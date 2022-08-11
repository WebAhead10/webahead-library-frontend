import React, { useState } from 'react'
import axios from 'utils/axios'
import basicAxios from 'axios'
import Dropzone from '../ImageDropzone'

interface ImageInputProps {
  height: string
  width: string
  onError(msg: string): void
  onChange(id: number | string): void
  value: string
}

const ImageInput = ({ height, width, onError, onChange, value }: ImageInputProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = React.useState<string>('')

  const uploadFile = (file: File, signedRequest: string, url: string) =>
    basicAxios
      .put(signedRequest, file, {
        headers: {
          'Content-Type': file.type
        }
      })
      .then((res) => {
        if (res.status === 200) {
          onChange(url)
          setLoading(false)
          return
        }

        onError('Could not upload file.')
        setLoading(false)
      })
      .catch((error) => console.log(error))

  const getSignedRequest = (file: File) => {
    if (file.size > 5000000) {
      onError('File should be below 50mb')
      return setError('File should be below 5mb')
    }

    setLoading(true)

    return axios
      .post(`/category/upload/signedRequest`, {
        fileName: file.name,
        fileType: file.type
      })
      .then((res) => {
        if (res.status === 200 && res.data.success) {
          uploadFile(file, res.data.signedRequest, res.data.url)
          return
        }

        onError('Could not get signed URL.')
        setLoading(false)
      })
      .catch((error) => error)
  }

  return (
    <div>
      <Dropzone
        width={width}
        height={height}
        value={value}
        loading={loading}
        error={!!error}
        prepareUpload={(file: File) => getSignedRequest(file)}
      />
    </div>
  )
}

export default ImageInput
