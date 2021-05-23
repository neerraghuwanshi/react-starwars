import React, { useState, useEffect, useRef } from 'react'

import PeopleItem from './PeopleItem'
import PeopleItemHeading from './PeopleItemHeading'
import styles from '../css/PeopleList.module.css'
import { fetchPeople } from '../helpers/fetchPeople'
import { sortPeople } from '../helpers/sortPeople'


function PeopleList({inputValue}) {

    const loaderRef = useRef()
    const loadingMore = useRef(false)

    const [peopleData, setPeopleData] = useState([])
    const [searchData, setSearchData] = useState([])
    const [sortType, setSortType] = useState('newest')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [page, setPage] = useState(1)

    const peopleList =  peopleData.map(
        person => (
            <PeopleItem
                key={person.url}
                person={person}/>
        )
    )

    const searchList = searchData.map(
        person => (
            <PeopleItem
                key={person.url}
                person={person}/>
        )
    )

    const changeSortType = (event) => {
        setSortType(event.target.value)
    }

    useEffect(() => {
        const handleSuccess = response => {
            if (response.data.next){
                setPage(prev => prev + 1)
            }
            else{
                setPage(null)
            }
            setPeopleData(response.data.results)
            setLoading(false)
        }

        const handleError = () => {
            setError(true)
            setLoading(false)
        }

        setLoading(true)
        setError(false)
        fetchPeople(
            '',
            handleSuccess,
            handleError
        )
    }, [])
    
    useEffect(()=> {
        setSortType('newest')
        setError(false)
        if (inputValue){
            const handleSuccess = response => {
                if (response.data.results.length === 0){
                    setError(true)
                }
                setSearchData(response.data.results)
                setLoading(false)
            }
    
            const handleError = () => {
                setError(true)
                setLoading(false)
            }
    
            setLoading(true)
            fetchPeople(
                `?search=${inputValue}`,
                handleSuccess,
                handleError
            )
        }
    }, [inputValue, setSortType])


    useEffect(() => {
        const isBottom = (element) => {
            return element.getBoundingClientRect().bottom <= window.innerHeight + 50
        }

        const handleSuccess = (response) => {
            if (response.data.next){
                setPage(prev => prev + 1)
            }
            else{
                setPage(null)
                document.removeEventListener('scroll', handleScroll)
            }
            setPeopleData(prev => {
                let newValue = [...prev, ...response.data.results]
                sortPeople(sortType, newValue)
                return newValue
            })
            loadingMore.current = false
        }

        const handleError = () => {
            setError(true)
            loadingMore.current = false
        }

        const handleScroll = () => {
            if(!inputValue && isBottom(loaderRef.current)){
                if (page && !loadingMore.current){
                    loadingMore.current = true
                    setError(false)
                    fetchPeople(
                        `?page=${page}`,
                        handleSuccess,
                        handleError
                    )
                }
            }
        }

        if (page){
            document.addEventListener('scroll', handleScroll)
        }
        else {
            document.removeEventListener('scroll', handleScroll)
        }

        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [inputValue, page, sortType])

    useEffect(() => {
        if (inputValue){
            setSearchData(prev => {
                let newValue = [...prev]
                sortPeople(sortType, newValue)
                return newValue
            })
        }
        else{
            setPeopleData(prev => {
                let newValue = [...prev]
                sortPeople(sortType, newValue)
                return newValue
            })
        }
    }, [sortType, inputValue])
            
    return (
        loading || error ?
        <div className={styles.centredContainer}>
            <i
                className={`fa fa-${
                    loading ? 
                        'spinner fa-pulse fa-4x' : 
                        `exclamation-circle ${styles.error} fa-5x`
                }`}
                aria-hidden="true" />
        </div> :
        <>
            <label className={styles.label}>
                <input
                    className={styles.radio}
                    type='radio'
                    value='newest'
                    checked={sortType === 'newest'}
                    onChange={changeSortType}
                    />
                    Newest
            </label>
            <label className={styles.label}>
                <input
                    className={styles.radio}
                    type='radio'
                    value='oldest'
                    checked={sortType === 'oldest'}
                    onChange={changeSortType}
                    />
                    Oldest
            </label>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        {peopleData.length > 0 && 
                            <PeopleItemHeading 
                                headings={
                                    Object.keys(peopleData[0])
                                }/>
                        }
                    </thead>
                    <tbody>
                        {inputValue ? searchList : peopleList}
                    </tbody>
                </table>
            </div>
            <div
                ref={loaderRef}
                className={`
                    ${styles.tableContainer} ${(page && !inputValue) ? styles.loadingContainer : ''}
                `}>
                {!inputValue && page &&
                <div className={styles.loader}>
                    <i 
                        className="fa fa-spinner fa-spin fa-2x" 
                        aria-hidden="true" />
                </div>}
            </div>
        </>
    )
}


export default PeopleList