import { styled, keyframes } from '@stitches/react';
import * as Accordion from '@radix-ui/react-accordion';

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

const AccordionCustom = () => {
  const data = [
    {
      title: "Title 1",
      content: "Bacon ipsum dolor amet turducken swine pancetta doner t-bone tongue, ground round landjaeger shoulder picanha. Meatloaf alcatra prosciutto pork. Ball tip shank leberkas, filet mignon sausage alcatra short loin bacon swine. Picanha pig bresaola fatback shoulder. Pork belly kevin landjaeger chislic ball tip. Shankle tri-tip cupim drumstick t-bone ribeye. Prosciutto shankle beef ribeye drumstick."
    },
    {
      title: "Title 2",
      content: "Burgdoggen frankfurter chislic pork loin porchetta beef ribs, pig jerky sirloin turkey alcatra tongue prosciutto beef ham. Jowl turducken pastrami ham hock drumstick pork chop chislic meatball pork frankfurter salami pork belly t-bone flank. Brisket buffalo leberkas pork belly chicken cow kevin. Pork loin drumstick chislic meatball, andouille strip steak bresaola frankfurter rump shank shoulder short ribs sirloin buffalo alcatra. Boudin bacon buffalo venison, brisket hamburger salami."
    },
  ]

  return (
    <Accordion.Root type="multiple" className='accordion'>
      {data.map((dat, index) => (
        <Accordion.Item key={`item-${index}`} value={`item-${index}`} className='accordion__item'>
          <AccordionHeader className='accordion__button'>
            <Accordion.Trigger className='accordion__trigger'>
              <span>{dat.title}</span>
            </Accordion.Trigger>
          </AccordionHeader>
          <AccordionContent className='accordion__content-wrapper'>
            <div className='accordion__content'>
              {dat.content}
            </div>
          </AccordionContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export default AccordionCustom