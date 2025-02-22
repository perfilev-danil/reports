"use server"

import { notFound } from "next/navigation"
import fetchData from "./fetchData"

export default async function getGubers() {
  const query = `
    query Gubers {
      gubers (pagination: { limit: 100 }) {
        data {
          id
          attributes {
            name
            description
            img {
              data {
                attributes {
                  url
                }
              }
            }
            periods {
              data {
                id
                attributes {
                  value
                }
              }
            }
            rank
            service
          }
        }
      }
    }
  `
  const json = await fetchData<GubersArrayT>({
    query,
  })

  {/*
    const sortedData = json.data.gubers.data.sort((a, b) => {
    return parseInt(a.id) - parseInt(b.id)
  })
    */}

  if (json.data?.gubers?.data.length === 0) notFound()

  const sortedData = json.data.gubers.data.sort((a, b) => {
    const periodA = a.attributes.periods?.data[0]?.attributes.value
    const periodB = b.attributes.periods?.data[0]?.attributes.value

    if (periodA && periodB) {
      const periodDiff = parseInt(periodA) - parseInt(periodB)
      if (periodDiff !== 0) {
        return periodDiff
      }
    }
    return parseInt(a.id) - parseInt(b.id)
  })

  return sortedData
}