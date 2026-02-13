// src/app/cooking-classes/page.tsx
export default function CookingClassesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ============================================= */}
      {/* HERO - Cooking Classes title + image + intro */}
      {/* ============================================= */}
      <section className="bg-gradient-to-b from-teal-700 via-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Cooking Classes
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed">
                Fresh Fast Food Hub has partnered with expert Ugandan chefs to help you learn how to make authentic local dishes that will elevate your cooking skills and bring the flavors of Kampala to your kitchen.
              </p>

              <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed">
                Learning to cook Ugandan favorites can be exciting! Whether you're new to the kitchen or a seasoned chef wanting to master Rolex, chapati, or traditional stews, you've come to the right place. Our online classes make it easy to learn from home.
              </p>
            </div>

            {/* Right - Image (matches screenshot position) */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl order-first lg:order-last">
              <img
                src="/images/cooking.jpg"
                alt="Woman preparing healthy meal"
                className="w-full h-auto object-cover aspect-[16/9] lg:aspect-[4/3] min-h-[400px] lg:min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* DON'T MISS A CLASS - teal banner */}
      {/* ============================================= */}
      <section className="bg-teal-600 text-white py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 lg:mb-6">
            Don't Miss a Class!
          </h2>

          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Create a Fresh Fast Food Hub account to learn about upcoming cooking classes in our monthly e-newsletter.
          </p>

          <a
            href="https://www.youtube.com/@scubeskitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-teal-700 px-10 sm:px-14 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl uppercase tracking-wide hover:bg-teal-50 transition shadow-lg"
          >
            Watch Our Classes on YouTube
          </a>
        </div>
      </section>

      {/* ============================================= */}
      {/* ON-DEMAND CLASSES */}
      {/* ============================================= */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 lg:mb-14 text-gray-800">
            Some of our on-demand cooking classes
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Chef-Led Cooking Classes", img: "https://img.freepik.com/premium-photo/enthusiastic-girl-cutting-cucumber-mom-supervision_922936-72097.jpg?w=2000" },
              { title: "Interactive Kitchen Sessions", img: "https://explorerdubailtd.com/wp-content/uploads/2022/11/shutterstock_1080191051-scaled.jpg" },
              { title: "Hands-On Cooking Workshops", img: "https://www.projectrenewal.org/wp-content/uploads/2023/12/5050-Image-6.jpg" },
              { title: "Culinary Skill Building", img: "https://goodfoodstudioza.com/wp-content/uploads/2023/06/IMG_9246.jpg" },
              { title: "Community Cooking Events", img: "https://www.activityhero.com/blog/wp-content/uploads/2016/03/volunteer2-720x336.jpg" },
              { title: "Interactive Cooking Classes", img: "https://media.istockphoto.com/id/1426351505/photo/senior-woman-cooking-on-a-cooking-class.jpg?s=612x612&w=0&k=20&c=CxlKxJnsjOped9jhtyKb0jTT9-EDYwK89c_zo5k5rqM=" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="relative h-48 sm:h-56">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 lg:mt-16">
            <a
              href="https://www.youtube.com/@scubeskitchen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-700 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl uppercase tracking-wide hover:bg-red-800 transition shadow-lg"
            >
              Watch Our Classes on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FAQ SECTION - expandable boxes */}
      {/* ============================================= */}
      <section
        className="py-16 lg:py-24 relative"
        style={{
          backgroundImage: `url('https://healthylife.com/blog/wp-content/uploads/2020/06/49446225_xl_web-1140x760.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 lg:mb-14 text-white">
            Cooking Class FAQs
          </h2>

          <div className="space-y-4">
            {[
              { q: "Are cooking classes free?", a: "Yes, all our live and on-demand cooking classes are completely free! Learn authentic Ugandan cuisine from the comfort of your home." },
              { q: "Are cooking classes only for Ugandans?", a: "No! Everyone is welcome. Our recipes showcase the rich flavors of Ugandan cuisine, perfect for food lovers worldwide." },
              { q: "How should I prepare for class?", a: "Just have your ingredients ready, a device to watch the stream, and an open mind! We provide full recipe lists in advance." },
              { q: "I am a beginner cook. Is Fresh Fast Food Hub still for me?", a: "Absolutely! Our classes are beginner-friendly and focus on simple, achievable techniques for making Ugandan favorites." },
              { q: "I have specific dietary needs. Will Fresh Fast Food Hub work for me?", a: "Yes — many classes include vegetarian, vegan, and other adaptations. Check the class description for dietary options." },
              { q: "Where can I watch Fresh Fast Food Hub cooking classes?", a: "Live classes are streamed on our platform. Past classes are available on-demand on our website and YouTube channel." },
            ].map((item, i) => (
              <details
                key={i}
                className="group"
              >
                <summary className="flex justify-between items-center px-6 py-5 cursor-pointer text-lg sm:text-xl font-semibold text-white group-hover:text-teal-300 transition">
                  {item.q}
                  <span className="text-2xl sm:text-3xl font-bold group-open:rotate-180 transition-transform duration-300">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-2 text-white text-base sm:text-lg">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FINAL CTA / FOOTER BANNER */}
      {/* ============================================= */}
      <section className="bg-teal-700 text-white py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Cook Ugandan?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto">
            Join our free cooking classes today and discover delicious, authentic Ugandan meals from the comfort of your home.
          </p>
          <a
            href="https://www.youtube.com/@scubeskitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-teal-700 px-12 py-5 rounded-full font-bold text-xl uppercase tracking-wider hover:bg-teal-50 transition shadow-2xl"
          >
            Watch Our Classes on YouTube
          </a>
        </div>
      </section>
    </div>
  );
}