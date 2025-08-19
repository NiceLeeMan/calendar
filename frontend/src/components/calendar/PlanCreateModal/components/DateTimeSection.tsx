
import TimePicker from '../../../ui/TimePicker'

interface DateTimeSectionProps {
  formData: any
  handleInputChange: (field: string, value: any) => void
}

const DateTimeSection = ({ formData, handleInputChange }: DateTimeSectionProps) => {

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">날짜 및 시간</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            min={formData.startDate || undefined}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료 날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate || formData.endDate || undefined}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 시간 <span className="text-red-500">*</span>
          </label>
          <TimePicker
            value={formData.startTime}
            onChange={(time) => handleInputChange('startTime', time)}
            placeholder="시작 시간"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료 시간 <span className="text-red-500">*</span>
          </label>
          <TimePicker
            value={formData.endTime}
            onChange={(time) => handleInputChange('endTime', time)}
            placeholder="종료 시간"
          />
        </div>
      </div>
    </div>
  )
}

export default DateTimeSection
