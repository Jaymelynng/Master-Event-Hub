import type { Event } from "@/types"

export const generateCopyText = (events: Event[], format: string): string => {
  let output = ""

  switch (format) {
    case "urls":
      output = events
        .map((event) => event.url || "")
        .filter(Boolean)
        .join("\n")
      break
    case "urls-by-gym":
      const gymGroups: Record<string, string[]> = {}
      events.forEach((event) => {
        if (event.gymName && event.url) {
          if (!gymGroups[event.gymName]) {
            gymGroups[event.gymName] = []
          }
          gymGroups[event.gymName].push(event.url)
        }
      })
      output = Object.entries(gymGroups)
        .map(([gym, urls]) => `${gym}:\n${urls.join("\n")}`)
        .join("\n\n")
      break
    case "csv":
      output = "Gym Name,Event Title,Date,Time,Type,Price,URL,Gym Address,Gym Phone\n"
      output += events
        .map(
          (event) =>
            `"${event.gymName || ""}","${event.title || ""}","${event.date || ""}","${event.time || ""}","${event.type || ""}","${event.price || ""}","${event.url || ""}","${event.gymAddress || ""}","${event.gymPhone || ""}"`,
        )
        .join("\n")
      break
    case "summary":
      output = events
        .map(
          (event) =>
            `${event.gymName || "Unknown Gym"} - ${event.title || "Untitled Event"}\nDate: ${event.date || "No date"} ${event.day ? `(${event.day})` : ""} at ${event.time || "No time"}\nType: ${event.type || "No type"} | Price: ${event.price || "No price"}\nURL: ${event.url || "No URL"}\n---`,
        )
        .join("\n")
      break
  }

  return output
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy: ", err)
    return false
  }
}
