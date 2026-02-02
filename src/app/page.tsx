"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BarChart3, Clock, Check, Video, MessageSquare, Share2, Mail, Linkedin, Github, Instagram } from "lucide-react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer transition-colors flex items-center gap-2" 
              onClick={() => router.push("/")}
            >
              <GraduationCap className="h-7 w-7 text-blue-600" />
              <span>Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Stream</span></span>
            </h1>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
              <a href="#for-teachers" className="text-gray-700 hover:text-gray-900 transition-colors">For Teachers</a>
              <a href="#for-students" className="text-gray-700 hover:text-gray-900 transition-colors">For Students</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">Contact Us</a>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                onClick={() => router.push("/authpage?mode=signup")}
              >
                Get Started →
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
  Interactive Live{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
    Teaching
  </span>{" "}
  with{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
    chat
  </span>,{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
    quizzes
  </span>{" "}
  &{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
    polls
  </span>
</h2>

              <p className="text-lg text-gray-600 mb-8">
                Create, share, and participate in live sessions, interact through real-time chat, engaging quizzes and polls. Designed for both educators and students to enhance the learning experience.

              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg"
                  onClick={() => router.push("/authpage?mode=signup")}
                >
                  Get Started →
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-6 text-lg rounded-lg"
                  onClick={() => router.push("/authpage?mode=login")}
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] bg-gray-200 rounded-lg">
              {/* Image placeholder - add your image here */}
              <img src="first_image.png" alt="showcase image" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Features */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Engaging Learning
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to create interactive live sessions and enhance the learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Video className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Live Video Streaming</h4>
              <p className="text-gray-600">
                Enable real-time video broadcasting with WebRTC technology for seamless teacher-student interaction.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Real-time Chat</h4>
              <p className="text-gray-600">
                Instant messaging with Socket.IO for dynamic discussions and quick question resolution.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Share2 className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Screen Sharing</h4>
              <p className="text-gray-600">
                Share your screen to demonstrate concepts, show presentations, and guide students visually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section id="for-teachers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] bg-gray-200 rounded-lg">
                <img src="/teacher_image.jpg" alt="Teacher Section" className="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">For Teachers</h3>
              <p className="text-lg text-gray-600 mb-8">
                Create engaging live sessions, track student progress, and gain valuable insights into learning outcomes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">Create engaging live sessions for your students</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">Interact through live chats, manage quizzes & polls</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">You can freely set the timing and duration for the sessions</p>
                </div>
              </div>

              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-lg"
                onClick={() => router.push("/authpage?mode=signup&role=teacher")}
              >
                Join as Teacher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section id="for-students" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">For Students</h3>
              <p className="text-lg text-gray-600 mb-8">
                Access learning materials, participate in live sessions, and track your personal progress.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">Join live sessions and interact with your teachers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">Access sessions anytime, anywhere with seamless live streaming</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">Experience immersive learning with live video, chat, quizzes, and interactive polls</p>
                </div>
              </div>

              <Button 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-lg"
                onClick={() => router.push("/authpage?mode=signup&role=student")}
              >
                Join as Student
              </Button>
            </div>
            <div className="relative h-[400px] bg-gray-200 rounded-lg">
              <img src="/student_image.jpg" alt="Student Section" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your learning more interactive?
          </h3>
          <p className="text-xl text-blue-50 mb-10">
            Join us and experience learning like never before
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            onClick={() => router.push("/authpage?mode=signup")}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
<footer id="contact" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-3 gap-12">
      {/* Brand */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-blue-600" />
          <span>Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Stream</span></span>
        </h1>
        <p className="text-gray-600 mb-6">
          A powerful platform for creating, sharing, and participating in live educational sessions. Designed for both teachers and students to enhance the learning experience.
        </p>
        <div className="flex items-center gap-6">
                    <a
                        href="mailto:sharmaabhinav1013@gmail.com"
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        aria-label="Email"
                    >
                        <Mail className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/abhinav-sharma-314319327"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0077b5] transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                        href="https://github.com/Abhinavsharma005"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.instagram.com/__abhinav_s10/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#E4405F] transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                </div>
      </div>

      {/* Features */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">FEATURES</h4>
        <ul className="space-y-3">
          <li>
            <a href="#for-teachers" className="text-gray-600 hover:text-gray-900 transition-colors">
              For Teachers
            </a>
          </li>
          <li>
            <a href="#for-students" className="text-gray-600 hover:text-gray-900 transition-colors">
              For Students
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Schedule Your Sessions
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Join Sessions from anywhere
            </a>
          </li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">COMPANY</h4>
        <ul className="space-y-3">
          <li>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About Us
            </a>
          </li>
          <li>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </li>
          <li>
            <span className="text-lg font-bold text-gray-900">DEVELOPER</span>
          </li>
          <li>
            <span className="text-gray-600">Abhinav Sharma</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
      <p className="text-gray-500">
        © 2026 EduStream. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}