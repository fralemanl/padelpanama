export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#003D99] to-[#001f5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">About Tennis Club</h1>
          <p className="text-lg">Excellence in Tennis since 1995</p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 text-lg mb-4">
            Founded in 1995, Tennis Club has been a cornerstone of the tennis
            community for over 25 years. What started as a small community
            project has grown into one of the region's premier tennis
            facilities.
          </p>
          <p className="text-gray-600 text-lg mb-4">
            Our mission is to promote the sport of tennis through professional
            coaching, world-class facilities, and community engagement. We
            believe that tennis is a sport for everyone, regardless of age or
            ability.
          </p>
          <p className="text-gray-600 text-lg">
            Today, we serve thousands of members, from recreational players to
            competitive athletes, and we continue to expand our programs and
            facilities to meet the needs of our growing community.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#003D99] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold">4</p>
              <p className="text-lg mt-2">Professional Courts</p>
            </div>
            <div>
              <p className="text-4xl font-bold">15+</p>
              <p className="text-lg mt-2">Expert Coaches</p>
            </div>
            <div>
              <p className="text-4xl font-bold">2000+</p>
              <p className="text-lg mt-2">Active Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold">30+</p>
              <p className="text-lg mt-2">Events Yearly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Michael Johnson",
                role: "Head Coach",
                bio: "20+ years of professional tennis experience",
              },
              {
                name: "Sarah Davis",
                role: "Facilities Manager",
                bio: "Expert in court maintenance and member services",
              },
              {
                name: "Emma Wilson",
                role: "Programs Director",
                bio: "Passionate about developing tennis talent",
              },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-[#003D99] font-semibold">{member.role}</p>
                <p className="text-gray-600 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                desc: "We strive for the highest standards in everything we do",
              },
              {
                title: "Community",
                desc: "We believe in building a supportive tennis community",
              },
              {
                title: "Inclusion",
                desc: "Tennis is for everyone, regardless of skill or background",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg border-l-4 border-[#003D99]"
              >
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
