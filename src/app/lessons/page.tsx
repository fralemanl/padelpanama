import Link from "next/link";

export default function LessonsPage() {
  const lessons = [
    {
      id: 1,
      title: "Beginner Tennis",
      level: "Beginner",
      coach: "John Smith",
      schedule: "Mon & Wed, 6:00 PM",
      duration: "8 weeks",
      price: "£120",
      spots: 8,
    },
    {
      id: 2,
      title: "Intermediate Techniques",
      level: "Intermediate",
      coach: "Emma Wilson",
      schedule: "Tue & Thu, 7:00 PM",
      duration: "8 weeks",
      price: "£150",
      spots: 6,
    },
    {
      id: 3,
      title: "Advanced Competition",
      level: "Advanced",
      coach: "Michael Johnson",
      schedule: "Sat, 10:00 AM",
      duration: "12 weeks",
      price: "£200",
      spots: 4,
    },
    {
      id: 4,
      title: "Kids Tennis Camp",
      level: "Ages 6-12",
      coach: "Sarah Davis",
      schedule: "Sat & Sun, 2:00 PM",
      duration: "4 weeks",
      price: "£80",
      spots: 10,
    },
  ];

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#003D99] to-[#001f5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Tennis Lessons</h1>
          <p className="text-lg">Professional coaching for all skill levels</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Learn from the Best</h2>
          <p className="text-gray-600 text-lg">
            Our certified coaches provide personalized instruction to help you
            improve your game. Whether you're just starting or looking to
            compete at a higher level, we have the right program for you.
          </p>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-6 shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {lesson.title}
                    </h3>
                    <p className="text-[#003D99] font-semibold text-sm">
                      {lesson.level}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[#003D99]">
                    {lesson.price}
                  </p>
                </div>

                <div className="space-y-2 mb-6 text-gray-600 text-sm">
                  <p>
                    <span className="font-semibold">👨‍🏫 Coach:</span>{" "}
                    {lesson.coach}
                  </p>
                  <p>
                    <span className="font-semibold">📅 Schedule:</span>{" "}
                    {lesson.schedule}
                  </p>
                  <p>
                    <span className="font-semibold">⏱️ Duration:</span>{" "}
                    {lesson.duration}
                  </p>
                  <p>
                    <span className="font-semibold">👥 Available Spots:</span>{" "}
                    {lesson.spots}
                  </p>
                </div>

                <button className="w-full bg-[#003D99] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#002a80] transition">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Our Lessons?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Coaches",
                desc: "Certified professionals with years of experience",
              },
              {
                title: "Small Groups",
                desc: "Max 10 participants per lesson for personal attention",
              },
              {
                title: "Flexible Schedules",
                desc: "Multiple times available throughout the week",
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="bg-[#003D99] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#003D99] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Improve Your Game?
          </h2>
          <p className="mb-6 text-lg">
            Contact us for more information or to schedule a trial lesson
          </p>
          <Link
            href="/contact"
            className="bg-white text-[#003D99] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
