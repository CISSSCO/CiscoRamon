
import CameraRig from '../canvas/CameraRig'
import Lights from '../canvas/Lights'
import Environment from '../canvas/Environment'

import IntroSection from '../sections/IntroSection'

export default function Experience() {
  return (
    <>
      <CameraRig />
      <Lights />
      <Environment />

      <IntroSection />
    </>
  )
}
