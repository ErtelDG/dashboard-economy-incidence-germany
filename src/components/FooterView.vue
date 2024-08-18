<template>
   <div class="border-t border-gray-100 sm:flex sm:items-center sm:justify-between lg:mx-auto max-w-screen-xl w-full h-16 px-8">
      <ul class="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
         <RouterLink class="text-gray-500 transition hover:opacity-75" to="/Impressum"> Impressum </RouterLink>
         <RouterLink class="text-gray-500 transition hover:opacity-75" to="/PrivacyPolicy"> Datenschutzrichtlinie </RouterLink>
      </ul>

      <ul class="mt-8 flex justify-center gap-6 sm:mt-0 lg:justify-end">
         <li>
            <a href="#" rel="noreferrer" target="_blank" class="text-gray-700 transition hover:opacity-75">
               <span class="sr-only">LinkedIn</span>

               <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                     fill-rule="evenodd"
                     d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.5c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.5h-3v-5.5c0-1.38-.62-2.5-2.25-2.5-1.32 0-2 1.11-2 2.5v5.5h-3v-10h3v1.28c.62-.95 1.72-1.78 3.25-1.78 2.42 0 4 1.59 4 4.5v6z"
                     clip-rule="evenodd"
                  />
               </svg>
            </a>
         </li>

         <li>
            <a href="#" rel="noreferrer" target="_blank" class="text-gray-700 transition hover:opacity-75">
               <span class="sr-only">GitHub</span>

               <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                     fill-rule="evenodd"
                     d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                     clip-rule="evenodd"
                  />
               </svg>
            </a>
         </li>
      </ul>
   </div>
</template>
