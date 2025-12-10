
const DashboardHome = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 font-medium">Total Trucks</h3>
                <p className="text-3xl font-bold mt-2">12</p>
             </div>
             <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-500 font-medium">Active Trips</h3>
                <p className="text-3xl font-bold mt-2 text-blue-600">4</p>
             </div>
             {/* More stats later */}
             <div className="col-span-full bg-white p-6 rounded-lg shadow mt-4">
                 <h3 className="text-lg font-bold mb-4">Welcome to TruckFlow</h3>
                 <p className="text-gray-600">Select a module from the sidebar to get started.</p>
             </div>
        </div>
    );
};
export default DashboardHome;
