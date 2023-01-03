import { styled, keyframes } from '@stitches/react';
import * as Accordion from '@radix-ui/react-accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '../../components/icons/Icon';
import Pill from '../pills/Pill';
import TogglePills from '../pills/TogglePills';
import {
  faDrumstickBite,
  faLemon,
  faPepperHot,
  faCheese,
  faFish,
  faJar,
  faCookieBite,
  faCarrot,
  faWineGlass,
  faToiletPaper,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

const open = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const close = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const AccordionHeader = styled(Accordion.Header, {
  margin: 0,
});

const AccordionContent = styled(Accordion.Content, {
  overflow: 'hidden',
  '&[data-state="open"]': { animation: `${open} 300ms ease-out` },
  '&[data-state="closed"]': { animation: `${close} 300ms ease-out` },
});

const AccordionCustom = ({ data }) => {
  return (
    <Accordion.Root type="multiple" className="accordion">
      {data.map((dat, index) => (
        <Accordion.Item
          key={`item-${index}`}
          value={`item-${index}`}
          className="accordion__item">
          <AccordionHeader className="accordion__button">
            <Accordion.Trigger className="accordion__trigger">
              <div className="flex items-center">
                <Icon classes={'mr-3'} type={'no-hover'}>
                  <FontAwesomeIcon
                    icon={
                      dat.icon === 'faDrumstickBite'
                        ? faDrumstickBite
                        : dat.icon === 'faLemon'
                        ? faLemon
                        : dat.icon === 'faPepperHot'
                        ? faPepperHot
                        : dat.icon === 'faCheese'
                        ? faCheese
                        : dat.icon === 'faFish'
                        ? faFish
                        : dat.icon === 'faJar'
                        ? faJar
                        : dat.icon === 'faCookieBite'
                        ? faCookieBite
                        : dat.icon === 'faCarrot'
                        ? faCarrot
                        : dat.icon === 'faWineGlass'
                        ? faWineGlass
                        : dat.icon === 'faToiletPaper'
                        ? faToiletPaper
                        : faUtensils
                    }
                  />
                </Icon>
                <span className="h4">
                  {dat.title} ({dat.content.length})
                </span>
              </div>
            </Accordion.Trigger>
          </AccordionHeader>
          <AccordionContent className="accordion__content-wrapper">
            <div className="accordion__content">
              {/* <TogglePills name={dat.icon} data={dat.content} /> */}
              <ul className={`pills pills--toggle text-center`}>
                {dat.content.map((pill, index) => (
                  <li key={`pill_${index}`}>
                    <Pill content={pill} />
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default AccordionCustom;
