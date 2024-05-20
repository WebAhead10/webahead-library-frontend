import { useQuery, useMutation } from '@tanstack/react-query'
import { ITagInput } from 'types'
import axios from 'utils/axios'

const useOverlayNotes = (overlayId: number) => {
  return useQuery<{
    mainNote: { text: string }
    notes: { text: string }[]
  }>(
    ['overlay-notes', overlayId],
    async () => {
      const res = await axios.get(`/overlay/notes/${overlayId}`)
      return {
        mainNote: res.data.mainNote,
        notes: res.data.notes
      }
    },
    {
      enabled: !!overlayId
    }
  )
}

const useOverlayTags = (overlayId: number) => {
  return useQuery<ITagInput[]>(
    ['overlay-tags', overlayId],
    async () => {
      const res = await axios.get(`/overlay/tags/${overlayId}`)
      return res.data.data
    },
    {
      enabled: !!overlayId
    }
  )
}

const useOverlayText = (overlayId: number) => {
  return useQuery(
    ['overlay-text', overlayId],
    async () => {
      const res = await axios.get(`/overlay/content/${overlayId}`)
      return {
        content: res.data.content,
        title: res.data.title,
        userName: res.data.userName
      }
    },
    {
      enabled: !!overlayId
    }
  )
}

const useOverlayCoords = (articleId: number) => {
  return useQuery(
    ['overlay-coords', articleId],
    async () => {
      const res = await axios.get(`/overlay/coords/${articleId}`)
      return res.data
    },
    {
      enabled: !!articleId,
      refetchOnWindowFocus: false
    }
  )
}

export { useOverlayNotes, useOverlayTags, useOverlayText, useOverlayCoords }
