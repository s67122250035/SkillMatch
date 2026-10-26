import {
  ref, get, set, push, update, remove, query, orderByChild, equalTo,
} from 'firebase/database'
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
} from 'firebase/auth'
import { db, auth } from './firebase'

const today = () => new Date().toISOString().slice(0, 10)

/* ---------- ตัวช่วยพื้นฐาน ---------- */
export const toList = (obj) =>
  Object.entries(obj || {}).map(([id, value]) => ({ id, ...value }))

const readNode = async (path) => {
  const snap = await get(ref(db, path))
  return snap.exists() ? snap.val() : {}
}

/* ---------- ข้อมูลหลักที่ทุกหน้าใช้ ---------- */
export async function fetchCatalog() {
  const [categories, skills, companies, jobs] = await Promise.all([
    readNode('skill_categories'),
    readNode('skills'),
    readNode('companies'),
    readNode('jobs'),
  ])
  return {
    categories: toList(categories),
    skills: toList(skills),
    companies: toList(companies),
    jobs: toList(jobs),
  }
}

/* ---------- Authentication + Profile ---------- */
export async function findProfileByEmail(email) {
  for (const [node, role] of [['admins', 'admin'], ['companies', 'company'], ['users', 'graduate']]) {
    const snap = await get(query(ref(db, node), orderByChild('email'), equalTo(email)))
    if (snap.exists()) {
      const [id, value] = Object.entries(snap.val())[0]
      return { id, node, ...value, role }
    }
  }
  return null
}

export async function registerAccount({ role, name, email, password, extra = {} }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const node = role === 'company' ? 'companies' : 'users'
  const newRef = push(ref(db, node))
  const base =
    role === 'company'
      ? { name, email, description: extra.description || '', website: extra.website || '', logo_url: '', verified: false }
      : { role: 'graduate', name, email, education: extra.education || '', skill_ids: [], resume_url: '', avatar_url: '' }
  await set(newRef, { ...base, created_at: today() })
  return cred.user
}

export const loginAccount = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const logoutAccount = () => signOut(auth)

export const updateProfileData = (node, id, data) =>
  update(ref(db, `${node}/${id}`), data)

/* ---------- Jobs ---------- */
export async function createJob(job) {
  const newRef = push(ref(db, 'jobs'))
  await set(newRef, { ...job, status: 'open', posted_at: today(), image_url: '' })
  return newRef.key
}
export const updateJob = (id, data) => update(ref(db, `jobs/${id}`), data)
export const deleteJob = async (id) => {
  await remove(ref(db, `jobs/${id}`))
  // ลบใบสมัครที่ผูกกับงานนี้ เพื่อไม่ให้เหลือข้อมูลอ้างอิงที่ไม่มีอยู่จริง
  const apps = toList(await readNode('applications')).filter((a) => a.job_id === id)
  await Promise.all(apps.map((a) => remove(ref(db, `applications/${a.id}`))))
}

/* ---------- Applications ---------- */
export const getAllApplications = async () => toList(await readNode('applications'))

export async function applyToJob(userId, jobId) {
  const existing = (await getAllApplications()).find(
    (a) => a.user_id === userId && a.job_id === jobId
  )
  if (existing) throw new Error('คุณสมัครตำแหน่งนี้ไปแล้ว')
  const newRef = push(ref(db, 'applications'))
  await set(newRef, { job_id: jobId, user_id: userId, status: 'pending', applied_at: today() })
}
export const setApplicationStatus = (id, status) =>
  update(ref(db, `applications/${id}`), { status })
export const withdrawApplication = (id) => remove(ref(db, `applications/${id}`))

/* ---------- Favorites ---------- */
export async function getFavoriteIds(userId) {
  return Object.keys(await readNode(`favorites/${userId}`))
}
export const setFavorite = (userId, jobId, on) =>
  on ? set(ref(db, `favorites/${userId}/${jobId}`), true) : remove(ref(db, `favorites/${userId}/${jobId}`))

/* ---------- Users / Admin ---------- */
export const getAllUsers = async () => toList(await readNode('users'))
export const setSuspended = (node, id, suspended) =>
  update(ref(db, `${node}/${id}`), { suspended })
export const getApplicantsProfiles = getAllUsers
