export const sortPeople = (sortType, A) => {
    switch (sortType) {
        case 'newest':
            A.sort((a, b) => {
                let first = new Date(a.created).getTime()
                let second = new Date(b.created).getTime()
                return first - second
            })
            break
        case 'oldest':
            A.sort((a, b) => {
                let first = new Date(a.created).getTime()
                let second = new Date(b.created).getTime()
                return second - first
            })
            break
        default:
            break
    }
}