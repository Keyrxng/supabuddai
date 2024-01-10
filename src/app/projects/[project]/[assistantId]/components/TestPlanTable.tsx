import { useEffect, useState } from "react"
import { toast } from "sonner"

import { handleViewFile, reformatMessage } from "@/lib/utils"
import { TestPlanDataTable } from "@/components/TestSuiteDataTable"

export function TestPlanTable({ recentRun }: any) {
  const [work, setWork] = useState({})

  useEffect(() => {
    async function load() {
      const toWork = recentRun.resp2.data
      toWork.forEach(async (work: any) => {
        const res = reformatMessage({
          message: work,
          recentRun: recentRun,
        })

        if (!res?.[0].thread_id) {
          return
        }

        if (res?.length === 0) {
          return
        }

        if (!res?.[0].thread_id) {
          return toast.error("No thread id found")
        }

        if (!res?.[0].message_id) {
          return toast.error("No message id found")
        }

        if (!res?.[0].file_id) {
          return toast.error("No file id found")
        }

        const fileda = await handleViewFile({
          fileId: res?.[0].file_id,
          messageId: res?.[0].message_id,
          threadId: res?.[0].thread_id,
        })

        if (!fileda) {
          return
        }

        if (fileda.resp2) {
          console.log(fileda.resp2)
          setWork((prev) => fileda.resp2)
        }
      })
    }

    load()
  }, [recentRun])

  useEffect(() => {}, [work])

  return <>{work && <TestPlanDataTable work={work} />}</>
}
