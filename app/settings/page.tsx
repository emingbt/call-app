"use client"

import Link from "next/link"

export default function Settings() {
  const handleOnSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Get the username
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string

    console.log("Changing username", username)

    try {
      if (!username) {
        return
      }

      localStorage.setItem("username", username)

      window.location.href = "/"
    }
    catch (error) {
      console.error("Failed to change username", error)
    }
  }

  return (
    <div className="w-full min-h-screen flex relative items-center justify-center bg-main-bg">
      <div className="p-4 absolute top-0 left-0">
        <Link href={"/"} className="text-lg text-white font-bold">Back</Link>
      </div>
      <main className="flex flex-col items-center sm:items-start">
        <h1 className="w-full text-xl font-bold mb-8">Settings</h1>
        <form className="w-full flex flex-col" onSubmit={handleOnSubmit}>
          <input
            className="w-full p-4 text-white bg-lightest-bg rounded-lg mb-8"
            placeholder="Enter new username"
            name="username"
          />
          <button
            className="w-56 lg:w-96 h-12 relative rounded-lg text-white bg-blue hover:bg-opacity-80"
            type="submit"
          >
            Change Username
          </button>
        </form>
      </main>
    </div>
  )
}