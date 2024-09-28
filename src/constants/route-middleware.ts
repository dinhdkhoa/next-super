const authPaths = ['/login', '/register', '/logout', 'refresh-token', '/tables']
const guestPaths = ['/guest']
const employeePaths = ['/manage']
const privatePath = [...guestPaths, ...employeePaths]

const isGuestPath = (pathName: string) => {
    return guestPaths.some(path => pathName.startsWith(path))
} 
const isEmployeePath = (pathName: string) => {
    return employeePaths.some(path => pathName.startsWith(path))
} 
const isAuthPath = (pathName: string) => {
    return authPaths.some(path => pathName.startsWith(path))
} 
const isPrivatePath = (pathName: string) => {
    return privatePath.some(path => pathName.startsWith(path))
} 

const isPublicPath = (pathName: string) => {
    return pathName === '/' || (!isPrivatePath(pathName) && !isAuthPath(pathName))
} 

const checkPathName = (pathName: string) => {
    return {
        isPublicPath: isPublicPath(pathName),
        isPrivatePath: isPrivatePath(pathName),
        isAuthPath: isAuthPath(pathName),
        isGuestPath: isGuestPath(pathName),
        isEmployeePath: isEmployeePath(pathName),
    }
}

export {
    isGuestPath,
    isEmployeePath,
    isAuthPath,
    isPrivatePath,
    isPublicPath,
    checkPathName
};