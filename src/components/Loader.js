export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-gray-900 mb-3"></div>
      <p className="text-gray-600 animate-pulse">Loading amazing photos...</p>
    </div>
  )
}