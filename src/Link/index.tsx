import { PlaidLinkOnSuccessMetadata, PlaidLinkOptionsWithLinkToken, usePlaidLink } from 'react-plaid-link';

 export interface LinkProps {
    linkToken: string,
    
}


const Link = (props: LinkProps)=>{

    
    const config: PlaidLinkOptionsWithLinkToken = {
        token: props.linkToken!,
        onSuccess : (token:string, metadata: PlaidLinkOnSuccessMetadata)=>{ console.log(`Token: ${token}`) },
    };
    
    const { open, ready } = usePlaidLink(config);

    return(
        <>
        <button onClick={() => open()}>Launch Link</button>
        </>
    )
}

export default Link;