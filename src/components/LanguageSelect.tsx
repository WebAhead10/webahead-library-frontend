// import { languageOptions } from '@/lib/constants'
// import { languageAtom } from '@/lib/recoil/atoms'
import { GlobalOutlined } from '@ant-design/icons'
import { Dropdown, Flex } from 'antd'
import { useRecoilState } from 'recoil'
import { languageAtom } from 'utils/recoil/atoms'
// import { LanguageDirection } from 'types'
// import Image from 'next/image'

interface IProps {
  bordered?: boolean
}

const languageOptions = [
  {
    key: 'en',
    label: 'English'
  },
  {
    key: 'ar',
    label: 'العربية'
  }
]

const LanguageSelect = ({ bordered }: IProps) => {
  const [languageObj, setLanguage] = useRecoilState(languageAtom)

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: languageOptions,
        onClick: ({ key }) => {
          if (key === 'en') {
            setLanguage({
              language: key,
              isRtl: false
            })
          } else if (key === 'he' || key === 'ar') {
            setLanguage({
              language: key,
              isRtl: true
            })
          } else {
            setLanguage({
              language: key,
              isRtl: false
            })
          }
        }
      }}
      overlayStyle={{
        top: '50px',
        position: 'fixed'
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          cursor: 'pointer',
          border: bordered ? '1px solid #E5E5E5' : 'none',
          borderRadius: '5px',
          padding: '0px 5px',
          height: '40px',
          width: '120px'
        }}
      >
        <GlobalOutlined
          style={{
            fontSize: '16px'
          }}
        />
        <span>{languageOptions.find((item) => item.key === languageObj.language)?.label || 'English'}</span>
        {/* <Image
          src="/icons/general/expand-icon.svg"
          width={22}
          height={22}
          style={{
            transform: 'rotate(270deg)'
          }}
          alt="expand-icon"
        /> */}
      </Flex>
    </Dropdown>
  )
}

export default LanguageSelect
