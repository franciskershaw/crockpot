import FocusTrap from "focus-trap-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faXmark} from '@fortawesome/free-solid-svg-icons'

// https://www.npmjs.com/package/focus-trap-react
const Modal = () => {
    // When modal is open apply fixed to body
    // Add close function to overlay as well so user can click outside modal to close

  return (
    <FocusTrap>
        <div className="modal">
            <div className="modal__overlay"></div>
            <div className="modal__wrapper">
                <div className="modal__header">
                    <h2>Heading!</h2>
                    <button className="icon icon--secondary">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
                <div className="modal__content">
                    <a href="">Tab tab tab</a>
                    <p>
                        Bacon ipsum dolor amet chuck pork loin strip steak, ground round capicola pork ham burgdoggen. Pork rump leberkas tongue tail ham, frankfurter sirloin turducken 
                    </p>
                    <p>
                        Bacon ipsum dolor amet chuck pork loin strip steak, ground round capicola pork ham burgdoggen. Pork rump leberkas tongue tail ham, frankfurter sirloin turducken pork loin shoulder capicola ham hock short ribs. Doner pig frankfurter, shankle tri-tip pork belly jowl leberkas brisket hamburger strip steak. Pork chop ham filet mignon leberkas kevin cupim chuck short loin tail turducken burgdoggen tenderloin. Jowl brisket meatloaf chicken. Biltong prosciutto kevin, jowl chuck ground round shoulder meatball rump porchetta turkey. Tri-tip shankle boudin, pastrami t-bone bacon burgdoggen tenderloin turducken brisket.

                        Bresaola sausage flank, meatball turkey prosciutto short ribs pancetta shankle. Cupim meatloaf tenderloin pork belly boudin pig landjaeger swine. Porchetta chicken hamburger, flank fatback capicola pork loin biltong tenderloin chuck turducken ham. Capicola pork chop turkey, drumstick flank prosciutto tenderloin picanha shoulder tongue. Capicola meatloaf buffalo burgdoggen. Hamburger sausage fatback buffalo t-bone. Ham beef t-bone, shank venison turkey salami chuck hamburger tri-tip burgdoggen.

                        Doner frankfurter sirloin meatball, bacon shoulder biltong. Meatloaf ball tip porchetta, pastrami strip steak burgdoggen shankle kielbasa beef. Boudin buffalo burgdoggen filet mignon, short ribs tail pork prosciutto meatball jowl drumstick chicken frankfurter turkey pig. Meatloaf doner turkey ribeye chislic.

                        Andouille tongue shankle, chuck chicken rump pork belly cow beef hamburger pork bacon. Strip steak shoulder drumstick, doner shank flank bresaola short ribs kielbasa rump leberkas pig alcatra. Corned beef burgdoggen capicola leberkas shankle meatball t-bone. Frankfurter chicken pork chop, leberkas capicola ground round corned beef jerky spare ribs hamburger buffalo jowl beef ribs bresaola pig. Pancetta pork loin cupim, sirloin ball tip andouille leberkas. Frankfurter shankle ground round, short loin pancetta swine flank pork belly cow bresaola venison meatball tri-tip biltong.

                        Sirloin kevin ground round bacon fatback tri-tip pork belly tenderloin corned beef meatloaf spare ribs. Venison bresaola drumstick, corned beef beef pork chop capicola ground round turducken fatback shankle biltong. Drumstick hamburger jerky pork belly. Meatloaf short ribs pork chop leberkas bresaola kevin chislic kielbasa sirloin t-bone short loin strip steak cupim. Pastrami flank doner, pork tenderloin pork loin sirloin filet mignon beef ribs drumstick tongue. Jerky alcatra short ribs pastrami, prosciutto tail swine andouille kielbasa ground round.

                        Does your lorem ipsum text long for something a little meatier? Give our generator a try… it’s tasty!
                    </p>
                </div>
            </div>
        </div>
    </FocusTrap>
  )
}

export default Modal