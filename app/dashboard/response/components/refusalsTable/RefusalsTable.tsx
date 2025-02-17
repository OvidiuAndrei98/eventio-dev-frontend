import Image from 'next/image'
import NoDataIllustration from '../../../../../public/no-data-illustration.svg'

const RefusalsTable = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <h1 className="primary-title text-center">
        Din fericire, nu exista niciun refuz
      </h1>
      <Image src={NoDataIllustration} alt="No-data" />
    </div>
  )
}

export default RefusalsTable
