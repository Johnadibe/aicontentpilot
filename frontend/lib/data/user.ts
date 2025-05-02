import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import type { User } from "@prisma/client"

export async function getUserById(id: string | undefined) {
  try {
    if (!id) return null

    const user = await db.user.findUnique({
      where: { id },
    })

    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    })

    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    const hashedPassword = await hash(data.password, 10)

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    })

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    // Remove password from data if it exists
    const { password, ...updateData } = data

    const user = await db.user.update({
      where: { id },
      data: updateData,
    })

    return user
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function updateUserPassword(id: string, password: string) {
  try {
    const hashedPassword = await hash(password, 10)

    const user = await db.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    })

    return user
  } catch (error) {
    console.error("Error updating user password:", error)
    throw error
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    })

    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}
