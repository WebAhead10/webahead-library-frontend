import React, { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Modal } from 'antd'

interface StyledDropzoneProps {
  height: string
  width: string
  error: boolean
  loading: boolean
  value: number | string | null
  prepareUpload: Function
}

export default function StyledDropzone({
  height = '300px',
  width = '300px',
  prepareUpload,
  value,
  loading,
  error
}: StyledDropzoneProps) {
  const isMobile = window.innerWidth <= 760

  const baseStyle = useMemo(
    () => ({
      flex: 1,
      display: 'flex',
      // ('column' as 'column') a solution for a typescript bug
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderRadius: 5,
      borderColor: error ? 'red' : 'white',
      borderStyle: 'dashed',
      cursor: 'pointer',
      color: 'black',
      height,
      outline: 'none',
      transition: 'border .24s ease-in-out',
      width
    }),
    [error, height, width]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      // confirm that the user has selected the correct file before uploading
      Modal.confirm({
        title: `Are you sure you want to upload this file? ${files[0].name}`,
        onOk: () => {
          if (Array.isArray(files) && files.length) {
            prepareUpload(files[0])
          }
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    }
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      borderColor: value && 'lightgreen'
    }),
    [value, baseStyle]
  )

  return (
    <div className="dropzone-container" style={{ marginBottom: isMobile ? '20px' : '0px' }}>
      <div {...getRootProps({ style } as { style: React.CSSProperties })}>
        <input {...getInputProps()} />
        {loading && <span className="spinner" style={{ borderWidth: '0.7em' }} />}
        {!value && !loading && (
          <img style={{ maxWidth: '45%', maxHeight: '45%' }} src="/assets/default-image.svg" alt="" />
        )}

        {value && !loading && (
          <img style={{ maxWidth: '40%', maxHeight: '40%', marginTop: '20px' }} src="/assets/tick.svg" alt="" />
        )}
      </div>
    </div>
  )
}
