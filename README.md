# Math Council Website
## Services Used
login in with club email and password on all areas
- [Vercel](https://vercel.com/)
  - Website hosting
  - question & answer PDFs stored on Vercel Blob Storage
- [Google Cloud Console](console.cloud.google.com)
  - Google Sign In configuration
- [Supabase](https://supabase.com/)
  - Postgress DB 
- [IONOS](https://www.ionos.com/domains/org-domain)
  - Domain provider
## Getting Started
1. Clone repo
2. Run `npm install` to install necessary packages
3. Run `npx prisma generate` to generate prisma client for db connection (nothing will work without this)
4. Run `npm run dev` to launch dev server
5. Set up Environment Variables
   - 
7. It is recommended to install the prettier vscode extension to keep the formatting clean, following eslint's rules
## Making Changes
Do these steps before pushing any changes to the main branch. Vercel automatically deploys any changes made to the main branch. If you push something to main without going through the steps below the build will fail and **THE WEBSITE WILL NOT WORK**. If you need to push something to github, but don't want it to deploy please work on a branch.
1. Run `npx eslint . --fix` this runs the linter to catch any errors and fixes some automatically.
2. It may give you some warnings or errors it can't fix, you will have to fix manually. After fixing, run the command again to ensure no new errors are found.
3. Run `npm run vercel-build` this is a custom build script that vercel runs to deploy the website. If this succeeds you can safely push changes to the main branch.
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
1. Go to `/prisma/schema.prisma` and add relevant columns/tables. (If you are adding a Column to an existing table it must either be nullable or have a default value defined)
2. Run `npx prisma migrate dev --name <name_of_change>`
3. Run `npx prisma generate` to update prisma client
4. Add/Update the relevant interfaces in `/lib/primitives.ts`
5. Go through the steps in [Making Changes](#making-changes).
## Best Practices
- DO NOT instantiate prisma client on any client side page. For any data you need from the DB, create an API route that uses prisma to request the relevant data, and call the api from the frontent using `fetch`.
- Secure APIs.
  - Check if a user is logged in like this:
    ```
    const session = await getServerSession(authOptions)

    if (!session?.user)
        return Response.json({ message: 'Unauthorized' }, { status: 403 })
    ```
  - Check if a user is admin like this:
    ```
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return Response.json({ error: 'Admin only' }, { status: 403 })
    ```
