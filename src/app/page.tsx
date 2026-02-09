"use client";

// src/app/page.tsx
import Navbar from "@/app/components/Navbar";
import HeroCarousel from "@/app/components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Carousel – main attraction */}
      <HeroCarousel />

      <main className="bg-gray-50">
        
        {/* ================= VISION SECTION ================= */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            
            {/* Vision */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                We cultivate with care and professionalism our greatest passion: to make your meal unique. Over the years we have responded to our customers with the best solutions of Catering and Quality Service, ensuring an impeccable service with its focus on competence and helpfulness. From the accuracy of the menu to the choice of the location, we guide you step by step with enthusiasm.
              </p>
            </div>

            {/* Our Philosophy */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-600 uppercase tracking-wider text-sm">
                Our Philosophy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Today, thanks to our gained experience, we are a landmark for businesses and individuals. We rely only on a team of professionals and highly qualified chefs and waiters, true flavor artists able to compose the menu with passion, excellence and care, playing with creativity the notes of your preferences to welcome you in a warm and hospitable atmosphere.
              </p>
            </div>

            {/* We and Your Dreams */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-600 uppercase tracking-wider text-sm">
                We and Your Dreams
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We want to see you happy and satisfied. For this reason, we seek excellence in every detail. For you we select only the freshest raw materials, the best ingredients, the finest cutlery and tablecloth sets to create scenographic presentations. And if you need advices, we are willing to help you with pleasure. For your company and for the most important ceremonies of your life.
              </p>
            </div>

          </div>
        </section>

        {/* ================= CORPORATE CATERING SECTION ================= */}
        <section 
          className="relative py-32 md:py-48 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('https://www.milano-catering.com/wp-content/uploads/2015/01/p_0021-600x400.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay - lighter for better image visibility */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 text-center text-white max-w-4xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Corporate catering
            </h2>
            <p className="text-xl md:text-3xl mb-4 font-light italic">
              One cannot think well, love well, sleep well if
            </p>
            <p className="text-xl md:text-3xl font-light italic">
              one has not eaten well.
            </p>
            <p className="text-lg md:text-xl mt-4 opacity-90">
              (Virginia Woolf)
            </p>
          </div>
        </section>

        {/* ================= FROM OUR CUSTOMERS SECTION ================= */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-16">
              From our Customers
            </h2>

            {/* Scrolling testimonials container */}
            <div className="relative overflow-hidden">
              <div className="flex gap-8 animate-scroll">
                {/* Testimonial 1 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub was the best choice we could have made for our event. The support prior to our event was outstanding. The organization of the event and the food were perfect.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Reception for private individuals</p>
                  <p className="text-gray-400 text-sm">Private customer</p>
                </div>

                {/* Testimonial 2 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Excellent service. Excellent food. Excellent organization. Simply excellent.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Corporate Event</p>
                  <p className="text-gray-400 text-sm">Private customer</p>
                </div>

                {/* Testimonial 3 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    I take this opportunity to thank the exceptional service provided to us on the occasion of the Marketing Meeting, with particular reference to the impeccable professionalism and availability of the Waiters.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">After a Corporate Buffet</p>
                  <p className="text-gray-400 text-sm">CORPORATE GROUP</p>
                </div>

                {/* Testimonial 4 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub catering service exceeded all our expectations. The quality of the food, the presentation, and the professionalism of the staff made our event truly memorable.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Wedding Reception</p>
                  <p className="text-gray-400 text-sm">HAPPY COUPLE</p>
                </div>

                {/* Testimonial 5 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The team at Fresh Fast Food Hub made our anniversary celebration truly special. Every detail was perfect, from the appetizers to the dessert. Highly recommended!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Anniversary Party</p>
                  <p className="text-gray-400 text-sm">MR & MRS JOHNSON</p>
                </div>

                {/* Testimonial 6 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    We booked Fresh Fast Food Hub for our company annual dinner. Professional service, delicious food, and a wonderful atmosphere. Will definitely use them again!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Company Annual Dinner</p>
                  <p className="text-gray-400 text-sm">TECH SOLUTIONS INC</p>
                </div>

                {/* Testimonial 7 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The wedding catering was absolutely fantastic! Our guests are still talking about the amazing food and beautiful presentation. Thank you for making our day perfect!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Wedding Catering</p>
                  <p className="text-gray-400 text-sm">SARAH & MICHAEL</p>
                </div>

                {/* Testimonial 8 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub delivered outstanding service for our product launch event. The food was exquisite and the presentation was impressive. Outstanding team!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Product Launch Event</p>
                  <p className="text-gray-400 text-sm">INNOVATION BRANDS</p>
                </div>

                {/* Testimonial 9 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    From start to finish, the experience was flawless. The food was delicious, the service was impeccable, and the team was incredibly accommodating. Five stars!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Birthday Celebration</p>
                  <p className="text-gray-400 text-sm">EMILY R.</p>
                </div>

                {/* Testimonial 10 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The baptism reception was beautifully organized. Fresh Fast Food Hub took care of every detail and exceeded our expectations. Thank you for such a memorable day!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Baptism Reception</p>
                  <p className="text-gray-400 text-sm">THE MARTINEZ FAMILY</p>
                </div>

                {/* Testimonial 11 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub catered our outdoor summer festival. The food was amazing and the staff was professional. Our guests loved every moment!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Summer Festival</p>
                  <p className="text-gray-400 text-sm">CITY EVENTS COUNCIL</p>
                </div>

                {/* Testimonial 12 */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The private dinner party was a huge success thanks to Fresh Fast Food Hub. Exquisite cuisine, elegant presentation, and exceptional service. Highly recommended!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Private Dinner Party</p>
                  <p className="text-gray-400 text-sm">DAVID & LISA W.</p>
                </div>

                {/* Duplicate set for seamless continuous loop */}
                {/* Testimonial 1 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub was the best choice we could have made for our event. The support prior to our event was outstanding. The organization of the event and the food were perfect.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Reception for private individuals</p>
                  <p className="text-gray-400 text-sm">Private customer</p>
                </div>

                {/* Testimonial 2 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Excellent service. Excellent food. Excellent organization. Simply excellent.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Corporate Event</p>
                  <p className="text-gray-400 text-sm">Private customer</p>
                </div>

                {/* Testimonial 3 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    I take this opportunity to thank the exceptional service provided to us on the occasion of the Marketing Meeting, with particular reference to the impeccable professionalism and availability of the Waiters.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">After a Corporate Buffet</p>
                  <p className="text-gray-400 text-sm">CORPORATE GROUP</p>
                </div>

                {/* Testimonial 4 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub catering service exceeded all our expectations. The quality of the food, the presentation, and the professionalism of the staff made our event truly memorable.
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Wedding Reception</p>
                  <p className="text-gray-400 text-sm">HAPPY COUPLE</p>
                </div>

                {/* Testimonial 5 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The team at Fresh Fast Food Hub made our anniversary celebration truly special. Every detail was perfect, from the appetizers to the dessert. Highly recommended!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Anniversary Party</p>
                  <p className="text-gray-400 text-sm">MR & MRS JOHNSON</p>
                </div>

                {/* Testimonial 6 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    We booked Fresh Fast Food Hub for our company annual dinner. Professional service, delicious food, and a wonderful atmosphere. Will definitely use them again!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Company Annual Dinner</p>
                  <p className="text-gray-400 text-sm">TECH SOLUTIONS INC</p>
                </div>

                {/* Testimonial 7 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The wedding catering was absolutely fantastic! Our guests are still talking about the amazing food and beautiful presentation. Thank you for making our day perfect!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Wedding Catering</p>
                  <p className="text-gray-400 text-sm">SARAH & MICHAEL</p>
                </div>

                {/* Testimonial 8 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub delivered outstanding service for our product launch event. The food was exquisite and the presentation was impressive. Outstanding team!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Product Launch Event</p>
                  <p className="text-gray-400 text-sm">INNOVATION BRANDS</p>
                </div>

                {/* Testimonial 9 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    From start to finish, the experience was flawless. The food was delicious, the service was impeccable, and the team was incredibly accommodating. Five stars!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Birthday Celebration</p>
                  <p className="text-gray-400 text-sm">EMILY R.</p>
                </div>

                {/* Testimonial 10 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The baptism reception was beautifully organized. Fresh Fast Food Hub took care of every detail and exceeded our expectations. Thank you for such a memorable day!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Baptism Reception</p>
                  <p className="text-gray-400 text-sm">THE MARTINEZ FAMILY</p>
                </div>

                {/* Testimonial 11 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    Fresh Fast Food Hub catered our outdoor summer festival. The food was amazing and the staff was professional. Our guests loved every moment!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Summer Festival</p>
                  <p className="text-gray-400 text-sm">CITY EVENTS COUNCIL</p>
                </div>

                {/* Testimonial 12 duplicate */}
                <div className="min-w-[350px] md:min-w-[450px] bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <div className="text-6xl text-gray-500 mb-4">"</div>
                  <p className="text-white text-lg mb-6 leading-relaxed">
                    The private dinner party was a huge success thanks to Fresh Fast Food Hub. Exquisite cuisine, elegant presentation, and exceptional service. Highly recommended!
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white font-semibold">Private Dinner Party</p>
                  <p className="text-gray-400 text-sm">DAVID & LISA W.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WE WILL BE YOUR TRUSTED PARTNER SECTION ================= */}
        <section 
          className="relative py-32 md:py-48 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('https://www.milano-catering.com/wp-content/uploads/2015/01/finger2-600x400.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay - lighter for better image visibility */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 text-center text-white max-w-4xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              We will be your trusted partner
            </h2>
            <p className="text-xl md:text-2xl mb-4 leading-relaxed">
              We will follow you on the most important occasions always with maximum availability.
            </p>
            <p className="text-lg md:text-xl mb-10 leading-relaxed">
              Your every request will be a creative stimulus for us, because your satisfaction is our main goal.
            </p>
            
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-black transition-all"
            >
              CONTACT US
            </Link>
          </div>
        </section>

        {/* ================= BANQUETING FOR PRIVATES SECTION ================= */}
        <section 
          className="relative py-32 md:py-48 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('/images/fast food.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay - lighter for better image visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10 text-center text-white max-w-5xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              Banqueting for Privates
            </h2>
            <p className="text-xl md:text-3xl mb-4 font-light italic">
              I have very simple tastes, I always settle for
            </p>
            <p className="text-xl md:text-3xl font-light italic mb-6">
              the best.
            </p>
            <p className="text-lg md:text-xl opacity-90">
              (Oscar Wilde)
            </p>
          </div>
        </section>

        {/* ================= THE BANQUETING DESCRIPTION ================= */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-800">
              The banqueting of Fresh Fast Food Hub
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              To make your wishes come true, Fresh Fast Food Hub works with the utmost professionalism and passion. Our team of experts is able to create menus and settings suitable for any context and situation. We know with absolute certainty that we will be able to satisfy you by guaranteeing you an <strong>impeccable and unforgettable Banqueting Service</strong>.
            </p>
          </div>
        </section>

        {/* ================= NAVIGATION BAR ================= */}
        <section className="py-6 px-4 md:px-8 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white text-sm md:text-base font-semibold">
              <span className="cursor-pointer hover:text-brand-yellow transition">BANQUETING</span>
              <span className="text-gray-500">|</span>
              <span className="cursor-pointer hover:text-brand-yellow transition">WEDDINGS</span>
              <span className="text-gray-500">|</span>
              <span className="cursor-pointer hover:text-brand-yellow transition">BAPTISMS AND COMMUNIONS</span>
              <span className="text-gray-500">|</span>
              <span className="cursor-pointer hover:text-brand-yellow transition">PARTIES</span>
            </div>
          </div>
        </section>

        {/* ================= OUR CORPORATE CATERING SERVICES ================= */}
        <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-gray-800">
              Our Corporate Catering services
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              
              {/* Weddings */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 uppercase tracking-wide">
                  Weddings
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To make your wedding unique, we entrust you with an excellent Wedding Planner. A professional at your disposal who with experience will accompany you until the day you say yes. Over the years we have fulfilled the dream of many married couples, creating state-of-the-art receptions, finely woven according to the taste and style of Love.
                </p>
              </div>

              {/* Food Delivery */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 uppercase tracking-wide">
                  Food Delivery
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience the convenience of having Fresh Fast Food Hub delivered right to your doorstep. We bring the same quality, freshness, and professionalism to every delivery. Whether it's a corporate lunch, family gathering, or special event, our delivery service ensures your food arrives hot, fresh, and on time - every time.
                </p>
              </div>

              {/* Online Booking */}
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 uppercase tracking-wide">
                  Online Booking
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your reception will be the protagonist of a fairy tale written with the colors of the party. We will support you with enthusiasm for any type of <strong>Celebration</strong> and <strong>Private Event</strong>. Imagine toasting with your guests and spending a special day with them in a special setting. With us your dream finally comes true!
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= MAKING OUR CUSTOMERS HAPPY SECTION ================= */}
        <section 
          className="relative py-32 md:py-48 px-4 md:px-8 flex items-center justify-center"
          style={{
            backgroundImage: `url('/images/image.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Bright overlay for better image visibility */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 text-center text-white max-w-5xl">
            {/* Chef icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-white rounded-full flex items-center justify-center">
                <span className="text-3xl md:text-4xl">👨‍🍳</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              Making our customers<br />happy is our mission!
            </h2>
            
            <p className="text-lg md:text-xl mb-10 leading-relaxed max-w-4xl mx-auto">
              Fresh Fast Food Hub always maintains its objectives by offering an excellent Catering Service and a highly selected Staff, with excellent training behind them. Our Events are distinguished by the quality of the cuisine and the environments: in an exclusive context specially selected according to your preferences, your Guests will be able to taste the authentic flavors of the best cuisine, celebrating unforgettable moments together.
            </p>
            
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-black transition-all"
            >
              REQUEST A QUOTE
            </Link>
          </div>
        </section>

        {/* ================= OUR SERVICES SECTION ================= */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-white drop-shadow-lg">
              Our Services
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Service 1 - Catering */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
                <img
                  src="https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Catering"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/2669443/2669443-hd_1280_720_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🍽️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                    Catering
                  </h3>
                </div>
              </div>

              {/* Service 2 - Food Delivery */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
                <img
                  src="https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Food Delivery"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/3205916/3205916-hd_1280_720_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🚗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                    Food Delivery
                  </h3>
                </div>
              </div>

              {/* Service 3 - Online Booking */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
                <img
                  src="https://images.pexels.com/photos/5077047/pexels-photo-5077047.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Online Booking"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/853843/853843-hd_1280_720_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">💻</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                    Online Booking
                  </h3>
                </div>
              </div>

              {/* Service 4 - Hotel Services */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-80">
                <img
                  src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hotel Services"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="https://videos.pexels.com/video-files/2406289/2406289-hd_1280_720_30fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🏨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                    Hotel Services
                  </h3>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dashboard Call-to-Action – kept as strong closer */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="bg-brand-red rounded-3xl sm:rounded-[4rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(239,68,68,0.3)]">
            <span className="absolute top-0 left-0 text-6xl sm:text-8xl md:text-[10rem] font-black text-white/5 select-none -translate-x-10">FRESH</span>

            <div className="relative z-10">
              <h2 className="text-white text-2xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 tracking-tighter">
                Everything is ready.<br />Just confirm your delivery.
              </h2>
              <Link
                href="/menu"
                className="inline-block bg-white text-brand-red px-6 sm:px-14 py-3 sm:py-6 rounded-full font-black text-base sm:text-xl hover:bg-brand-yellow hover:text-black hover:scale-110 transition-all shadow-2xl"
              >
                START ORDER NOW 🛒
              </Link>
            </div>
          </div>
        </section>
      </main>

      </>
  );
}
