const authPaths = ['/login', '/register', '/tables']
const authAPIPaths = ['/refresh-token', '/logout']
const guestPaths = ['/guest']
const employeePaths = ['/manage']
const ownerPaths = ['/manage/accounts']
const privatePath = [...guestPaths, ...employeePaths]

const isGuestPath = (pathName: string) => {
    return guestPaths.some(path => pathName.startsWith(path))
} 
const isEmployeePath = (pathName: string) => {
    return employeePaths.some(path => pathName.startsWith(path)) && ownerPaths.every(path => path !== pathName)
} 
const isAuthPath = (pathName: string) => {
    return authPaths.some(path => pathName.startsWith(path))
} 
const isPrivatePath = (pathName: string) => {
    return privatePath.some(path => pathName.startsWith(path))
} 
const isAuthAPIPath = (pathName: string) => {
    return authAPIPaths.some(path => pathName.startsWith(path))
} 

const isPublicPath = (pathName: string) => {
    return( pathName === '/' || (!isPrivatePath(pathName) && !isAuthPath(pathName))) && !isAuthAPIPath(pathName)
} 

const checkPathName = (_pathName: string) => {
    const pathName = _pathName.slice(3,_pathName.length)
    return {
        isPublicPath: isPublicPath(pathName),
        isPrivatePath: isPrivatePath(pathName),
        isAuthPath: isAuthPath(pathName),
        isGuestPath: isGuestPath(pathName),
        isEmployeePath: isEmployeePath(pathName),
        isAuthAPIPath: isAuthAPIPath(pathName),
    }
}

export {
    isGuestPath,
    isEmployeePath,
    isAuthPath,
    isPrivatePath,
    isPublicPath,
    checkPathName,
    isAuthAPIPath
};