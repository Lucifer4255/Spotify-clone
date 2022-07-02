import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState()
  const [refreshToken, setRefreshToken] = useState()
  const [expiresIn, setExpiresIn] = useState()
  useEffect(() => {
    const linkLocal="localhost:3000"
    const linkHeroku="bearded-canoe-12839.herokuapp.com"
    axios
      .post(`https://localhost:3000/login`, {
        code,
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        setRefreshToken(res.data.refreshToken)
        setExpiresIn(res.data.expiresIn)
        window.history.pushState({}, null, "/")
      })
      .catch(() => {
        window.location = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post(`https://localhost:3000/refresh`, {
          refreshToken,
        })
        .then(res => {
          setAccessToken(res.data.accessToken)
          setExpiresIn(res.data.expiresIn)
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken
}
