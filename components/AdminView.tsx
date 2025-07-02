"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { COLORS } from "@/constants/theme"
import { getGyms, getEventTypes } from "@/lib/data-service"

export const AdminView = () => {
  const [gyms, setGyms] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    gymId: "",
    eventTypeId: "",
    title: "",
    eventDate: "",
    eventTime: "",
    price: "",
    dayOfWeek: "",
    specificUrl: "",
  })

  // Fetch gyms and event types
  useState(() => {
    async function fetchData() {
      const gymsData = await getGyms()
      const eventTypesData = await getEventTypes()
      setGyms(gymsData)
      setEventTypes(eventTypesData)
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            gym_id: formData.gymId,
            event_type_id: formData.eventTypeId,
            title: formData.title,
            event_date: formData.eventDate,
            event_time: formData.eventTime,
            price: formData.price,
            day_of_week: formData.dayOfWeek,
            specific_url: formData.specificUrl,
          },
        ])
        .select()

      if (error) throw error

      setMessage("Event added successfully!")
      setFormData({
        gymId: "",
        eventTypeId: "",
        title: "",
        eventDate: "",
        eventTime: "",
        price: "",
        dayOfWeek: "",
        specificUrl: "",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.text }}>
        Add New Event
      </h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Gym
            </label>
            <select
              name="gymId"
              value={formData.gymId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">Select Gym</option>
              {gyms.map((gym) => (
                <option key={gym.id} value={gym.id}>
                  {gym.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Event Type
            </label>
            <select
              name="eventTypeId"
              value={formData.eventTypeId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Event Time
            </label>
            <input
              type="text"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              placeholder="e.g. 6:30 PM - 9:30 PM"
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. $35"
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Day of Week
            </label>
            <select
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Specific URL
            </label>
            <input
              type="url"
              name="specificUrl"
              value={formData.specificUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-2 border rounded"
              style={{ borderColor: COLORS.border }}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded text-white font-medium transition-colors"
            style={{ backgroundColor: loading ? COLORS.secondary : COLORS.primary }}
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  )
}
