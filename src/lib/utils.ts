import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function reformatMessage({
  recentRun,
  message,
}: {
  recentRun: any
  message: any
}) {
  if (!recentRun) {
    toast.error("No recent run found")
    return
  }
  let message_content = message.content[0].text
  let annotations = message_content.annotations
  let citations = new Set()
  let file_citations = []

  for (let index = 0; index < annotations.length; index++) {
    let annotation = annotations[index]

    if (annotation.type === "file_path") {
      let cited_file = annotation.file_path.file_id
      const regexForCitation =
        /(\[Download )(.+)(\]\(sandbox:\/mnt\/data\/)(.+)(\))/g

      message_content.value = message_content.value.replace(
        regexForCitation,
        ""
      )

      file_citations.push({
        file_id: cited_file,
        message_id: message.id,
        thread_id: message.thread_id,
      })
    } else if (annotation.type === "file_citation") {
      let cited_file = annotation.file_citation.file_id
      const regexForCitation = /【(\d+)†source】/g

      message_content.value = message_content.value.replace(
        regexForCitation,
        ""
      )

      citations.add(`${index + 1}. [${cited_file.slice(0, 8)}]`)

      file_citations.push({
        file_id: cited_file,
        message_id: message.id,
        thread_id: message.thread_id,
        index: index,
      })
    }
  }

  if (file_citations.length > 0) {
    return file_citations
  }
}

export async function handleViewFile({
  threadId,
  messageId,
  fileId,
}: {
  threadId: string
  messageId: string
  fileId: string
}) {
  if (!threadId) {
    return toast.error("No thread id found")
  }

  if (!messageId) {
    return toast.error("No message id found")
  }

  if (!fileId) {
    return toast.error("No file id found")
  }
  try {
    const data = await fetch("/api/ai/read-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        messageId,
        fileId,
      }),
    })

    const json = await data.json()
    console.log("File data", json)

    if (json.error) {
      toast.error(json.error.message)
      return
    }

    return json
  } catch (err) {
    console.error(err)
  }
}
