import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)
export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)  

