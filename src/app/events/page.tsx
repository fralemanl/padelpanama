import Link from "next/link";

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Spring Championship 2026",
      date: "March 15-17, 2026",
      location: "Courts 1-4",
      type: "Tournament",
      description:
        "Annual spring tennis championship. All skill levels welcome.",
      participants: 32,
      price: "£45",
    },
    {
      id: 2,
      title: "Beginner's Tennis Workshop",
      date: "March 20, 2026",
      location: "Court 2",
      type: "Workshop",
      description: "Learn the basics of tennis. Equipment provided.",
      participants: 12,
      price: "£25",
    },
    {
      id: 3,
      title: "Mixed Doubles Night",
      date: "April 5, 2026",
      location: "Courts 3-4",
      type: "Social",
      description: "Casual mixed doubles matches. Great for networking!",
      participants: 24,
      price: "£15",
    },
    {
      id: 4,
      title: "Summer Coaching Camp",
      date: "July 1-31, 2026",
      location: "All Courts",
      type: "Training",
      description: "Intensive coaching program with professional trainers.",
      participants: 20,
      price: "£300",
    },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#003D99] to-[#001f5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Tennis Events</h1>
          <p className="text-lg">
            Join our exciting tournaments, workshops, and training programs
          </p>
        </div>
      </div>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="border-l-4 border-[#003D99] rounded-lg p-8 bg-white shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {event.title}
                    </h2>
                    <p className="text-[#003D99] font-semibold mt-1">
                      {event.type}
                    </p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-[#003D99]">
                      {event.price}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 text-gray-600">
                  <p>
                    <span className="font-semibold">📅 Date:</span> {event.date}
                  </p>
                  <p>
                    <span className="font-semibold">📍 Location:</span>{" "}
                    {event.location}
                  </p>
                  <p>
                    <span className="font-semibold">👥 Participants:</span>{" "}
                    {event.participants}
                  </p>
                </div>

                <p className="text-gray-700 mb-4">{event.description}</p>

                <button className="bg-[#003D99] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#002a80] transition">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Don't see what you're looking for?
          </h2>
          <Link
            href="/contact"
            className="text-[#003D99] font-semibold hover:text-[#001f5c] text-lg"
          >
            Contact us to suggest new events →
          </Link>
        </div>
      </section>
    </div>
  );
}
