import LandingPageMainText from './landingPageMainText'
import LandingPageIcons from './landingPageIcons'

const Hero = () => {
    return (
        <div className="h-[calc(100vh-64px)] w-full bg-gradient-to-br from-background to-secondary-foreground/20">
            <div className="h-[calc(100vh-128px)] lg:h-full flex flex-col lg:flex-row lg:items-center justify-center lg:justify-between max-w-7xl mx-auto px-6 py-12 gap-12">
                <LandingPageMainText />
                <LandingPageIcons />
            </div>
        </div>
    )
}

export default Hero
