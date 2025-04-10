'use client'

import { useEffect, useState } from 'react'
import '@/styles/globals.css'
import { EventInstance } from '@/core/types'
import { queryEventsByUser } from '@/service/event/queryEventsByUser'
import EventsTable from './components/eventsTable/EventsTable'
import { columns } from './components/eventsTable/columns'
import { Button } from 'antd'
import { PlusIcon } from 'lucide-react'
import { useAuth } from '@/core/AuthenticationBoundary'

const DashboardPage = () => {
  const [queryEventLoading, setQueryEventLoading] = useState(true)
  const [events, setEvents] = useState<EventInstance[]>([])
  const user = useAuth().userDetails

  useEffect(() => {
    if (!user?.userId) {
      return
    }
    queryEventsByUser(user.userId).then((events) => {
      setEvents(events)
      setQueryEventLoading(false)
    })
  }, [user])

  return (
    <div className="events-container h-full p-4 bg-[#F6F6F6]">
      <h1 className="text-2xl font-bold">Bine ai venit, {user?.displayName}</h1>
      <div className="container min-h-[300px] my-4 mx-auto p-4 bg-white rounded-md shadow-sm relative">
        {queryEventLoading ? (
          <span className="loader"></span>
        ) : (
          <>
            <div className="flex flex-row items-start justify-between">
              <div>
                <h1 className="font-semibold">Invitatiile mele</h1>
                <span className="text-sm text-slate-500">
                  {events.length} invitatii
                </span>
              </div>
              <Button className="p-4" type="default">
                <PlusIcon size={16} /> Invitatie noua
              </Button>
            </div>
            <EventsTable columns={columns} data={events} />
          </>
        )}
      </div>
      <div className="container mx-auto py-10 bg-white rounded-md shadow-sm p-4 flex flex-col items-center justify-center">
        {events.length === 0 ? (
          <h1 className="text-center text-black text-2xl font-bold">
            Nu ai evenimente adaugate
          </h1>
        ) : (
          <h1 className="text-center text-black text-2xl font-bold">
            Vrei sa incerci si alt model?
          </h1>
        )}
        <span className="text-center text-slate-500">
          Ai la dispozitie un numar nelimitat de invitatii.
        </span>
        <Button className="mt-4 p-4" type="primary">
          Creaza invitatie
        </Button>
      </div>
    </div>
  )
}

export default DashboardPage
