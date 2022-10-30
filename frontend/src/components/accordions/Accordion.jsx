import * as Accordion from '@radix-ui/react-accordion';

const AccordionTest = () => {

  return (
    <Accordion.Root type="multiple" className='accordion'>
      <Accordion.Item value="item-1" className='accordion__item'>
        <Accordion.Header className='accordion__button'>
          <Accordion.Trigger className='accordion__trigger'>
            <span>Trigger text</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className='accordion__content'>
          Bacon ipsum dolor amet tongue ribeye salami, filet mignon fatback drumstick short loin biltong. Tri-tip ball tip alcatra, corned beef pork ground round turkey drumstick hamburger rump. Flank boudin chuck rump ribeye turducken tenderloin andouille spare ribs jerky pancetta cow shoulder meatloaf porchetta. Biltong venison picanha spare ribs. Short loin alcatra turducken, kielbasa chuck pancetta jowl pork belly spare ribs. Drumstick sirloin capicola, pancetta shankle andouille buffalo chicken porchetta. Andouille bresaola bacon doner strip steak chicken salami shank corned beef capicola meatloaf.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2" className='accordion__item'>
        <Accordion.Header className='accordion__button'>
          <Accordion.Trigger className='accordion__trigger'>
            <span>Trigger text</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className='accordion__content'>
          Bacon ipsum dolor amet tongue ribeye salami, filet mignon fatback drumstick short loin biltong. Tri-tip ball tip alcatra, corned beef pork ground round turkey drumstick hamburger rump. Flank boudin chuck rump ribeye turducken tenderloin andouille spare ribs jerky pancetta cow shoulder meatloaf porchetta. Biltong venison picanha spare ribs. Short loin alcatra turducken, kielbasa chuck pancetta jowl pork belly spare ribs. Drumstick sirloin capicola, pancetta shankle andouille buffalo chicken porchetta. Andouille bresaola bacon doner strip steak chicken salami shank corned beef capicola meatloaf.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3" className='accordion__item'>
        <Accordion.Header className='accordion__button'>
          <Accordion.Trigger className='accordion__trigger'>
            <span>Trigger text</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className='accordion__content'>
          Bacon ipsum dolor amet tongue ribeye salami, filet mignon fatback drumstick short loin biltong. Tri-tip ball tip alcatra, corned beef pork ground round turkey drumstick hamburger rump. Flank boudin chuck rump ribeye turducken tenderloin andouille spare ribs jerky pancetta cow shoulder meatloaf porchetta. Biltong venison picanha spare ribs. Short loin alcatra turducken, kielbasa chuck pancetta jowl pork belly spare ribs. Drumstick sirloin capicola, pancetta shankle andouille buffalo chicken porchetta. Andouille bresaola bacon doner strip steak chicken salami shank corned beef capicola meatloaf.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

export default AccordionTest