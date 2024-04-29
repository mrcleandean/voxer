import { LucideProps } from "lucide-react";

const Icons = {
    logo: (props: LucideProps) => (
        <svg {...props} width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.0">
            <defs>
                <clipPath id="eb2ad10766">
                    <path d="M 81 15 L 325 15 L 325 317 L 81 317 Z M 81 15 " clipRule="nonzero" />
                </clipPath>
                <clipPath id="b7bfee1a90">
                    <path d="M 50.335938 58.527344 L 227.152344 3.265625 L 324.921875 316.09375 L 148.105469 371.355469 Z M 50.335938 58.527344 " clipRule="nonzero" />
                </clipPath>
                <clipPath id="374b326fd8">
                    <path d="M 226.804688 3.375 L 49.988281 58.636719 L 147.757812 371.464844 L 324.574219 316.203125 Z M 226.804688 3.375 " clipRule="nonzero" />
                </clipPath>
            </defs>
            <g clipPath="url(#eb2ad10766)">
                <g clipPath="url(#b7bfee1a90)">
                    <g clipPath="url(#374b326fd8)">
                        <path className="fill-foreground" d="M 275.527344 159.945312 C 275.527344 159.945312 216.820312 178.292969 216.820312 178.292969 C 216.820312 178.292969 324.453125 316.496094 324.453125 316.496094 C 324.453125 316.496094 81.0625 156.285156 81.0625 156.285156 C 81.0625 156.285156 159.257812 131.5625 159.257812 131.5625 C 159.257812 131.5625 89.621094 46.210938 89.621094 46.210938 C 89.621094 46.210938 187.464844 15.632812 187.464844 15.632812 C 187.464844 15.632812 275.527344 159.949219 275.527344 159.949219 Z M 275.527344 159.945312 " fillOpacity="1" fillRule="nonzero" />
                    </g>
                </g>
            </g>
        </svg>
    ),
    google: (props: LucideProps) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
    ),
    user: (props: LucideProps) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}

export default Icons;