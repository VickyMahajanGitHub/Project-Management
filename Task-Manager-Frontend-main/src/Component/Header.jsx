import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import girlpicture from "../assets/images/girlpicture.png";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  EnvelopeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect
  };

  // Dark Mode Toggle
  const handleThemeChange = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Apply Theme on Load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []); // ✅ Only run once on mount

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Disclosure as="nav" className="bg-white dark:bg-gray-900 shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                {/* Desktop Search Bar */}
                <div className="hidden sm:flex items-center flex-1 justify-center sm:justify-start">
                  <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Search here"
                      className="block w-full pl-10 pr-3 py-2 border rounded-3xl bg-gray-200 dark:bg-gray-800 dark:text-white focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Mobile Search Icon */}
                <div className="flex sm:hidden">
                  <button
                    onClick={toggleMobileSearch}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400"
                  >
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-end sm:items-stretch">
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                    {/* Header Navigation Items can go here if needed */}
                  </div>
                </div>

                {/* Right side icons */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                  {/* Dark/Light Mode Toggle */}
                  <button
                    onClick={handleThemeChange}
                    className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
                  >
                    {darkMode ? (
                      <SunIcon
                        className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <MoonIcon
                        className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* Notification Icons - Always Visible */}
                  <div className="flex items-center">
                    <button className="p-1 ml-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <EnvelopeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button className="p-1 ml-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  {/* Profile Menu */}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        src={girlpicture}
                        alt="Profile"
                        className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-700" : "",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-700" : "",
                                "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-gray-700" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Mobile Search Bar - shown conditionally */}
            {mobileSearchOpen && (
              <div className="px-2 pt-2 pb-3 sm:hidden">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search here"
                    className="block w-full pl-10 pr-3 py-2 border rounded-3xl bg-gray-200 dark:bg-gray-800 dark:text-white focus:outline-none text-sm"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Header;
