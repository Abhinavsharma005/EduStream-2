import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function DashboardFooter() {
    return (
        <footer className="w-full py-6 mt-auto bg-white dark:bg-[#101828] border-t dark:border-gray-800 transition-colors">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
                    <span>&copy; 2026 EduStream. All rights reserved.</span>
                    <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <div className="flex items-center gap-1">
                        <span>Developed by</span>
                        <a href="mailto:sharmaabhinav1013@gmail.com" className="font-medium text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Abhinav Sharma
                        </a>
                    </div>
                </div>

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
        </footer>
    );
}
