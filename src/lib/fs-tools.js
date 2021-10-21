import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors")
const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)
export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)  
export const saveAuthorsAvatars = (fileName, contentAsBuffer) => writeFile(join(authorsPublicFolderPath, fileName), contentAsBuffer)
export const saveBlogCover = (fileName, contentAsBuffer) => writeFile(join(blogPostsPublicFolderPath, fileName), contentAsBuffer)

