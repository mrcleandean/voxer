const UserPageLayout = ({
    children,
    followModal
}: {
    children: React.ReactNode,
    followModal: React.ReactNode
}) => {
    return (
        <>
            {followModal}
            {children}
        </>
    )
}

export default UserPageLayout;