"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AlertTriangle, Medal, ChevronDown, Calendar, ChevronLeft, ChevronRight, Users, Store, Handshake, TestTube } from "lucide-react"
import dashboardContent from "@/content/agent/dashboard.json"
import { useAuth } from "@/components/auth/AuthProvider"

const TIMELINE_OFFSET = 140

type TimelinePosition =
  | "incoming-left"
  | "left"
  | "center"
  | "right"
  | "incoming-right"
  | "outgoing-left"
  | "outgoing-right"

interface TimelineItemState {
  id: string
  index: number
  position: TimelinePosition
}

export function Content() {
  const { user } = useAuth()
  return (
    <div className="space-y-6 p-6">

      {/* Main Banner */}
      <div className="relative bg-gradient-to-r from-[#03438f] to-[#025a9b] overflow-hidden shadow-lg border-b-32 border-[#03438f]">
        <div className={`absolute inset-0`} 
                style={{
          backgroundImage: `url('/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        />
          {/* <Image src="/bg.png" alt="banner" width={1000} height={1000} className="w-full h-full object-cover"/> */}
        {/* </div> */}
        <div className="relative p-32 text-white">
          <div className="flex items-center text-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Halo, {user?.name.split(' ')[0]}, {dashboardContent.dashboard.welcome}</h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100">{dashboardContent.dashboard.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DNA Customer Care Section */}
      <DNACustomerCareSection />

      {/* Paragon Stats Section */}
      <ParagonStatsSection />

      {/* Paragon Values & Identity Section */}
      <ParagonValuesIdentitySection />

      {/* Decorative Separator */}
      <DashboardSectionDivider />

      {/* Channel Overview Section */}
      <ParagonChannelsSection />


      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{dashboardContent.dashboard.topPerformers}</h3>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">{dashboardContent.dashboard.headOffice}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Dean Osfadila</p>
                      <p className="text-sm text-gray-600">97.5% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Gold</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Novita</p>
                      <p className="text-sm text-gray-600">92.8% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Silver</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Khalda</p>
                      <p className="text-sm text-gray-600">90.5% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">Bronze</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">E-Commerce</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Agent 1</p>
                      <p className="text-sm text-gray-600">97.5% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Gold</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Agent 2</p>
                      <p className="text-sm text-gray-600">97.5% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Silver</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <Medal className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Agent 3</p>
                      <p className="text-sm text-gray-600">97.5% CSAT Score</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">Bronze</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-900">Daily Update!</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Kamis, 02 Oktober 2025</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">XXXX</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">XXXXXXXX</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">XXXXXXX</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <span className="text-sm text-gray-700">XXXXX</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

function DNACustomerCareSection() {
  const dnaData = dashboardContent.dashboard.dnaCustomerCare
  const timeline = dnaData.timeline

  if (timeline.length === 0) {
    return null
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [timelineOffset, setTimelineOffset] = useState(TIMELINE_OFFSET)
  const isMobileTimeline = timelineOffset < TIMELINE_OFFSET
  const [items, setItems] = useState<TimelineItemState[]>(() => {
    const len = timeline.length
    if (len === 0) return []
    const leftIndex = (len + currentIndex - 1) % len
    const rightIndex = (currentIndex + 1) % len
    return [
      { id: `item-${leftIndex}-left`, index: leftIndex, position: 'left' },
      { id: `item-${currentIndex}-center`, index: currentIndex, position: 'center' },
      { id: `item-${rightIndex}-right`, index: rightIndex, position: 'right' },
    ]
  })

  useEffect(() => {
    if (isAnimating) return
    const len = timeline.length
    if (len === 0) return
    const leftIndex = (len + currentIndex - 1) % len
    const rightIndex = (currentIndex + 1) % len
    setItems([
      { id: `item-${leftIndex}-left`, index: leftIndex, position: 'left' },
      { id: `item-${currentIndex}-center`, index: currentIndex, position: 'center' },
      { id: `item-${rightIndex}-right`, index: rightIndex, position: 'right' },
    ])
  }, [currentIndex, timeline.length, isAnimating])

  useEffect(() => {
    const updateOffset = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      if (width < 640) {
        setTimelineOffset(90)
      } else if (width < 1024) {
        setTimelineOffset(120)
      } else {
        setTimelineOffset(TIMELINE_OFFSET)
      }
    }

    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [])

  const handlePrevious = () => {
    if (isAnimating || timeline.length < 2) return
    const len = timeline.length
    const newCenterIndex = (currentIndex - 1 + len) % len
    const incomingIndex = (currentIndex - 2 + len) % len

    setIsAnimating(true)

    const incomingItem: TimelineItemState = {
      id: `item-${incomingIndex}-incoming-left-${Date.now()}`,
      index: incomingIndex,
      position: 'incoming-left',
    }

    setItems((prev) => [
      incomingItem,
      ...prev.map((item) => {
        if (item.position === 'left') {
          return { ...item, position: 'center' as TimelinePosition }
        }
        if (item.position === 'center') {
          return { ...item, position: 'right' as TimelinePosition }
        }
        if (item.position === 'right') {
          return { ...item, position: 'outgoing-right' as TimelinePosition }
        }
        return item
      }),
    ])

    requestAnimationFrame(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.position === 'incoming-left'
            ? { ...item, position: 'left' as TimelinePosition }
            : item
        )
      )
    })

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.position !== 'outgoing-right'))
      setCurrentIndex(newCenterIndex)
      setIsAnimating(false)
    }, 500)
  }

  const handleNext = () => {
    if (isAnimating || timeline.length < 2) return
    const len = timeline.length
    const newCenterIndex = (currentIndex + 1) % len
    const incomingIndex = (currentIndex + 2) % len

    setIsAnimating(true)

    const incomingItem: TimelineItemState = {
      id: `item-${incomingIndex}-incoming-right-${Date.now()}`,
      index: incomingIndex,
      position: 'incoming-right',
    }

    setItems((prev) => [
      ...prev.map((item) => {
        if (item.position === 'left') {
          return { ...item, position: 'outgoing-left' as TimelinePosition }
        }
        if (item.position === 'center') {
          return { ...item, position: 'left' as TimelinePosition }
        }
        if (item.position === 'right') {
          return { ...item, position: 'center' as TimelinePosition }
        }
        return item
      }),
      incomingItem,
    ])

    requestAnimationFrame(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.position === 'incoming-right'
            ? { ...item, position: 'right' as TimelinePosition }
            : item
        )
      )
    })

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.position !== 'outgoing-left'))
      setCurrentIndex(newCenterIndex)
      setIsAnimating(false)
    }, 500)
  }

  const handleYearClick = (index: number) => {
    if (isAnimating) return
    const centerItem = items.find((item) => item.position === 'center')
    const leftItem = items.find((item) => item.position === 'left')
    const rightItem = items.find((item) => item.position === 'right')

    if (centerItem && index === centerItem.index) return
    if (leftItem && index === leftItem.index) {
      handlePrevious()
      return
    }
    if (rightItem && index === rightItem.index) {
      handleNext()
      return
    }
    setCurrentIndex(index)
  }

  const centerItem = items.find((item) => item.position === 'center')
  const currentItem = centerItem ? timeline[centerItem.index] : timeline[currentIndex]
  const positionStyles: Record<TimelinePosition, string> = {
    'incoming-left': `calc(50% - ${timelineOffset * 2}px)`,
    left: `calc(50% - ${timelineOffset}px)`,
    center: '50%',
    right: `calc(50% + ${timelineOffset}px)`,
    'incoming-right': `calc(50% + ${timelineOffset * 2}px)`,
    'outgoing-left': `calc(50% - ${timelineOffset * 2}px)`,
    'outgoing-right': `calc(50% + ${timelineOffset * 2}px)`,
  }

  return (
    <div className="my-16 lg:my-24">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 lg:py-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 font-extrabold text-[#064379]">{dnaData.title}</h2>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
        {/* Left Section - About Paragon */}
        <div className="relative px-4 lg:px-0">
          <div className="relative h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden">
            <Image
              src={dnaData.aboutParagon.image}
              alt="About Paragon"
              fill
              className="object-contain lg:object-cover px-4 lg:px-8"
              priority
            />
            
          </div>
        </div>

        {/* Right Section - Timeline */}
        <div className="px-4 lg:px-8 py-8 flex flex-col justify-center gap-6 lg:gap-8 lg:h-[300px]">
          <div className="justify-center items-center flex">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#064379] text-center">{dnaData.aboutParagon.history}</h3>
          </div>
          <div className="relative justify-center items-center">
            {/* Navigation Arrows */}
            <div className="flex items-center justify-center">
              <ChevronLeft 
                onClick={handlePrevious}
                className={`absolute z-10 text-[#064379] hover:text-[#0259b7] transition-colors cursor-pointer ${
                  isMobileTimeline
                    ? 'left-6 top-1/2 -translate-y-1/2 w-12 h-12'
                    : 'left-24 top-1/4 -translate-y-1/2 -translate-x-4 w-16 h-16'
                }`}
                aria-label="Previous year"
                strokeWidth={4}
              />

              <ChevronRight 
                onClick={handleNext}
                className={`absolute z-10 text-[#064379] hover:text-[#0259b7] transition-colors cursor-pointer ${
                  isMobileTimeline
                    ? 'right-6 top-1/2 -translate-y-1/2 w-12 h-12'
                    : 'right-24 top-1/4 -translate-y-1/2 translate-x-4 w-16 h-16'
                }`}
                aria-label="Next year"
                strokeWidth={4}
              />

              {/* Timeline Circles */}
              <div className="relative h-36 mb-8">
                {items.map((item) => {
                  const isActive = item.position === 'center'
                  const opacity =
                    item.position === 'incoming-left' ||
                    item.position === 'incoming-right' ||
                    item.position === 'outgoing-left' ||
                    item.position === 'outgoing-right'
                      ? 0
                      : 1

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleYearClick(item.index)}
                      className="absolute"
                      style={{
                        left: positionStyles[item.position],
                        top: '50%',
                        transform: `translate(-50%, -50%) scale(${isActive ? 1.4 : 0.9})`,
                        opacity,
                        transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out',
                        zIndex: isActive ? 30 : 10,
                        pointerEvents: item.position.includes('incoming') || item.position.includes('outgoing') ? 'none' : 'auto',
                      }}
                    >
                      <div
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white font-bold shadow-lg  ${
                          isActive ? 'bg-gradient-to-br from-[#064379] to-[#0259b7] ring-4 ring-[#0259b7]/30 text-xl' : 'bg-gradient-to-br from-[#0643796b] to-[#025ab78a]'
                        }`}
                      >
                        {timeline[item.index]?.year ?? ''}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div className="text-center min-h-[80px] flex items-center justify-center">
              <p 
                key={currentIndex}
                className="text-[#064379] text-lg font-semibold leading-relaxed max-w-lg mx-auto"
              >
                {currentItem.description}
              </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

function ParagonStatsSection() {
  const statsData = dashboardContent.dashboard.paragonStats

  if (!statsData) {
    return null
  }

  const iconMap = {
    users: Users,
    store: Store,
    handshake: Handshake,
    tube: TestTube,
  }

  const highlightWord = 'Paragonian'
  const descriptionParts = statsData.description.split(new RegExp(`(${highlightWord})`, 'gi'))

  return (
    <section className="mx-6 sm:mx-12 px-6 py-12 my-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="space-y-4 w-full lg:w-2/3 text-center lg:text-left">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#064379]">
          {statsData.title}
        </h3>
        <p className="text-xl md:text-2xl text-[#064379] leading-relaxed">
          {descriptionParts.map((part, idx) =>
            part.toLowerCase() === highlightWord.toLowerCase() ? (
              <span key={idx} className="font-black text-[#0159b6]">
                {part}
              </span>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </p>
      </div>

      <div className="bg-gradient-to-b from-[#58d1e6] to-[#0d4190] text-white rounded-3xl shadow-xl p-6 sm:p-8 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.stats.map((stat) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap] ?? Users
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-8 border-white flex items-center justify-center bg-white/10">
                  <IconComponent className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold">
                    {stat.value}
                  </p>
                  <p className="text-base md:text-lg lg:text-xl text-white/80 font-semibold">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ParagonValuesIdentitySection() {
  const valueIdentity = dashboardContent.dashboard.valueIdentity

  if (!valueIdentity) {
    return null
  }

  const renderList = (
    items: string[],
    align: 'left' | 'right',
  ) => (
    <div className={`space-y-5 ${align === 'left' ? 'text-left' : 'text-right'}`}>
      {items.map((item) => (
        <div key={item} className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse ml-auto' : ''}`}>
          <div className="lg:w-10 lg:h-10 w-6 h-6 rounded-full bg-white/90 text-[#064379] flex items-center justify-center shadow">
            {align === 'left' ? (
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" strokeWidth={4} />
            ) : (
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" strokeWidth={4} />
            )}
          </div>
          <span className="text-md sm:text-md lg:text-2xl font-semibold text-white leading-2 lg:leading-10">{item}</span>
        </div>
      ))}
    </div>
  )

  const panelBaseClasses = "flex-1 w-full p-8 rounded-3xl text-white shadow-xl flex flex-col justify-start" as const
 
   return (
    <section className="mx-6 sm:mx-12 lg:mx-32 px-6 my-24">
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-16 lg:gap-32">
        {/* Left Panel */}
        <div
          className={`${panelBaseClasses} min-h-[500px] lg:min-h-[640px]`}
          style={{
            background:
              'linear-gradient(90deg, #0d4190 0%, #58d1e6 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 140px), 50% 100%, 0 calc(100% - 140px))',
          }}
        >
          <h4 className="text-4xl text-center font-extrabold mb-6">
            {valueIdentity.left.title}
          </h4>
          <div className="pt-4 flex flex-col items-center justify-center">
            {renderList(valueIdentity.left.items, 'left')}
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex flex-col items-center justify-center text-center gap-6 order-first lg:order-none">
          <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[440px] lg:h-[440px]">
            <Image
              src={valueIdentity.logoImage}
              alt="Paragon Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`${panelBaseClasses} min-h-[500px] lg:min-h-[640px]`}
          style={{
            background:
              'linear-gradient(270deg, #0d4190 0%, #58d1e6 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 140px), 50% 100%, 0 calc(100% - 140px))',
          }}
        >
          <h4 className="text-4xl text-center font-extrabold mb-6">
            {valueIdentity.right.title}
          </h4>
          <div className="pt-4 flex flex-col items-center justify-center">
            {renderList(valueIdentity.right.items, 'right')}
          </div>
        </div>
      </div>
    </section>
  )
}

function ParagonChannelsSection() {
  const channels = dashboardContent.dashboard.channelsOverview

  if (!channels) {
    return null
  }

  return (
    <section className="mx-24 px-6 my-24">
      <div className="text-center">
        <h3 className="text-lg md:text-4xl font-extrabold text-[#0259b7]">
          {channels.title}
        </h3>
        <div className="mt-12 relative w-full max-w-4xl mx-auto">
          <div className="relative w-full aspect-[1/1] sm:aspect-[1182/700]">
            <Image
              src={channels.image}
              alt="Paragon channels overview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardSectionDivider() {
  return (
    <div className="mx-24 my-16">
      <div className="relative">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#0259b7] to-transparent opacity-60" />
        <div className="absolute inset-0 flex justify-center">
          {/* <div className="w-24 h-24 rounded-full border-4 border-[#0259b7]/50 flex items-center justify-center bg-white"> */}
            {/* <div className="w-16 h-1 bg-[#0259b7] rotate-45" /> */}
          {/* </div> */}
        </div>
        <div className="absolute inset-x-0 -bottom-3 flex justify-between px-8">
          <div className="w-16 h-1 bg-gradient-to-r from-[#0259b7] to-transparent" />
          <div className="w-16 h-1 bg-gradient-to-l from-[#0259b7] to-transparent" />
        </div>
      </div>
    </div>
  )
}
