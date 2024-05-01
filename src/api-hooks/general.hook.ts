import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'utils/axios'

const useTags = () => {
  return useQuery(['tags'], async () => {
    const res = await axios.get(`/tag/all`)
    return res.data.data
  })
}

export { useTags }
