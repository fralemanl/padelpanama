import Link from "next/link";

export default function CourtReservationPage() {
  const courts = [
    {
      id: 1,
      name: "Court 1",
      surface: "Hard Court",
      capacity: 2,
      hourlyRate: "£25",
    },
    {
      id: 2,
      name: "Court 2",
      surface: "Clay Court",
      capacity: 2,
      hourlyRate: "£30",
    },
    {
      id: 3,
      name: "Court 3",
      surface: "Hard Court",
      capacity: 4,
      hourlyRate: "£40",
    },
    {
      id: 4,
      name: "Court 4",
      surface: "Grass Court",
      capacity: 2,
      hourlyRate: "£35",
    },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#003D99] to-[#001f5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Court Reservation</h1>
          <p className="text-lg">Book your perfect tennis court in minutes</p>
        </div>
      </div>

      {/* Reservation Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <form className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-semibold mb-2">Court</label>
                <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#003D99]">
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} - {court.surface} ({court.hourlyRate}/hour)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#003D99]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Start Time</label>
                <input
                  type="time"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#003D99]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Duration (hours)
                </label>
                <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#003D99]">
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Player Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#003D99]"
              />
            </div>

            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-[#003D99] rounded">
              <p className="font-semibold">
                Estimated Total:{" "}
                <span className="text-[#003D99] text-lg">£25.00</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#003D99] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#002a80] transition"
            >
              Complete Reservation
            </button>
          </form>
        </div>
      </section>

      {/* Available Courts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Courts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {courts.map((court) => (
              <div
                key={court.id}
                className="border rounded-lg p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-3">{court.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Surface:</span>{" "}
                    {court.surface}
                  </p>
                  <p>
                    <span className="font-semibold">Capacity:</span>{" "}
                    {court.capacity} players
                  </p>
                  <p>
                    <span className="font-semibold">Rate:</span>{" "}
                    {court.hourlyRate}/hour
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
