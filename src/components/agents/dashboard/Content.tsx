"use client"

import { AlertTriangle, Medal, ChevronDown, Calendar } from "lucide-react"
import dashboardContent from "@/content/agent/dashboard.json"
import { useAuth } from "@/components/auth/AuthProvider"

export function Content() {
  const { user } = useAuth()
  return (
    <div className="space-y-6 mt-14 p-6">
      {/* High Priority Case Alert */}
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">{dashboardContent.dashboard.highPriorityAlert.title}</h3>
            <p className="text-sm">
              {dashboardContent.dashboard.highPriorityAlert.message}
            </p>
          </div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="relative bg-gradient-to-r from-[#03438f] to-[#025a9b] rounded-xl overflow-hidden shadow-lg">
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
              <h2 className="text-6xl font-bold mb-2">Halo, {user?.name.split(' ')[0]}, {dashboardContent.dashboard.welcome}</h2>
              <p className="text-xl text-blue-100">{dashboardContent.dashboard.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers This Month */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{dashboardContent.dashboard.topPerformers}</h3>
            
            {/* Head Office Section */}
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

            {/* E-Commerce Section */}
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

        {/* Daily Update Section */}
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
      </div>
    </div>
  )
}
