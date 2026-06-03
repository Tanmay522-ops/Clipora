const DarkMode = () => {
    return (
        <div className="flex w-20 h-14 sm:w-24 sm:h-16 md:w-32 md:h-20 rounded-lg overflow-hidden border border-gray-700">
            <div className="w-full bg-[#1c1c1c] p-1 flex flex-col gap-1">
                <div className="flex gap-0.5">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-400" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-400" />
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="bg-gray-600 rounded w-full h-1.5 sm:h-2" />
                <div className="bg-gray-600 rounded w-full h-1.5 sm:h-2" />
                <div className="bg-gray-600 rounded w-full h-1.5 sm:h-2" />
                <div className="bg-gray-600 rounded w-3/4 h-1.5 sm:h-2" />
            </div>
        </div>
    )
}

export default DarkMode