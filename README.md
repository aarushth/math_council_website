# Math Council Website

### Services Used

Login in with club email and password on all services

- [Vercel](https://vercel.com/)
    - Website hosting
    - PDFs stored on Vercel Blob Storage
- [Google Cloud Console](console.cloud.google.com)
    - Google Sign In configuration
- [Supabase](https://supabase.com/)
    - Postgress DB
- [Cloudflare](https://www.cloudflare.com/products/registrar/)
    - Domain provider

## Getting Started

1. Clone repo
2. Run `npm install` to install necessary packages
3. Create a `.env` file to store environment Variables
4. Login in to [Vercel](https://vercel.com/), Open the Project and click on Settings, then Environment Variables, and copy the following into your `.env`
    - NEXTAUTH_SECRET
    - DATABASE_URL
    - DIRECT_URL
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - BLOB_READ_WRITE_TOKEN
5. You will also have to create a variable called `NEXTAUTH_URL` and set it to wherever you are hosting the dev server, eg: `http://localhost:3000`

    > **DO NOT PUSH ANY ENVIRONMENT VARIABLES TO GITHUB**

6. Run `npx prisma generate` to generate prisma client for db connection
7. Run `npm run dev` to launch dev server
8. I recommend installing the `Prettier - Code formatter` and `Tailwind CSS IntelliSense` vscode extension to help with formatting and styling.

## Making Changes

Do these steps before pushing any changes to the main branch. Vercel automatically deploys any changes made to the main branch. If you push something to main without going through the steps below the build will fail and **THE WEBSITE WILL NOT WORK**. If you need to push something to github, but don't want it to deploy please work on a branch.

1. Run `npx eslint . --fix` this runs the linter to catch any errors and fixes some automatically.
2. It may give you some warnings or errors it can't fix, you will have to fix them manually. After fixing, run the command again to ensure no new errors are found.
3. Run `npm run vercel-build`. This is a custom build script that vercel runs to deploy the website. If this succeeds you can safely push changes to the main branch.

## Common Changes

### Changing pictures on Homepage

1. Run any images you want to upload through [tinyJPG](https://tinyjpg.com/) to reduce the file size while maintaining resolution
2. Add/Remove necessary images in `\public\homepageImages\`
3. Open `config\site.ts` and update the `homePagePictures` array by adding/removing picture filenames
4. Go through the steps in [Making Changes](#making-changes).

### Adding a new page

1. Create a new folder in `/app/`. Its name will be the name of the generated page.
2. Within this folder create a file name `page.tsx`. Any code for this page will go in here
3. To add this page to the navbar, go to `config/site.ts` and add a new object to `siteConfig.navItems`. The object needs to contain an href which should be a `/` followed by the name of the folder created in step 1, and a label which is whatever you want the page to be named on the navbar.
4. Go through the steps in [Making Changes](#making-changes).

### Adding colums/tables to the Database

1. Go to `/prisma/schema.prisma` and add relevant columns/tables.
    - If you are adding a column to an existing table it must either be nullable or have a default value defined
2. Run `npx prisma migrate dev --name <name_of_change>`
3. Run `npx prisma generate` to update prisma client
4. Add/Update the relevant interfaces in `/lib/primitives.ts`
5. Go through the steps in [Making Changes](#making-changes).

## Best Practices

- Try not to install new packages unless absolutely necessary
    - Use [HeroUI](https://www.heroui.com/) components for any new things, to ensure easy theme management, reactivity, accessibility, etc.
    - If HeroUI doesn't have a relevant component you need, check [ShadCN](https://ui.shadcn.com/) before creating your own/installing another package
    - Try to do any styling with inbuilt component props. Use [TailwindCSS](https://tailwindcss.com/) for more customizability. Only write custom CSS when absolutely necessary (I only had to write some once).
    - Use [react-icons](https://react-icons.github.io/react-icons/) for any icons.
- DO NOT import/use prisma on any client facing page. For any data you need from the DB, create an API route that uses the prisma client defined in `/prisma/prisma.ts` to request the relevant data, and call the api from the frontent using `fetch()`.
- Secure APIs like this.

    - Check if a user is logged in:

        ```
        import { authOptions } from '@/lib/auth'
        import { getServerSession } from 'next-auth/next'

        const session = await getServerSession(authOptions)
        if (!session?.user)
            return Response.json({ message: 'Unauthorized' }, { status: 403 })
        ```

    - Check if a user is admin:

        ```
        import { authOptions } from '@/lib/auth'
        import { getServerSession } from 'next-auth/next'

        const session = await getServerSession(authOptions)
        if (!session?.user?.admin)
            return Response.json({ error: 'Admin only' }, { status: 403 })
        ```

- Prisma doesn't work if the `prisma`and `@prisma/client` packages are on different versions. Always ensure they are the same version after installing/updating packages by running `npx prisma --version`

# Relevant Docs

### UI

- [React](https://react.dev/reference/react) v19.2
- [HeroUI](https://www.heroui.com/docs) v2.8.7 for almost all components
- [ShadCN](https://ui.shadcn.com/docs) for any complex components
- [TailwindCSS](https://tailwindcss.com/docs/installation/using-postcss) v4.1 for styling
- [React-Icons](https://react-icons.github.io/react-icons/) v5.5 for icons

### Backend

- [NextJS](https://nextjs.org/docs) v16.1.4 React Web Server Framework
- [Prisma](https://www.prisma.io/docs/orm/) v7.3.0 ORM for DB Connection
- [NextAuth](next-auth.js.org/getting-started/introduction) v4 Oauth library for login

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
