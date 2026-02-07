import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'
import getConversations from '../actions/getConversations'
import getUsers from '../actions/getUsers'

async function ConversationLayout({
    children
} : {
    children: React.ReactNode
}) {
    const conversations = await getConversations();
    const users = await getUsers();



  return (
    <Sidebar>
        <div className="h-full">
            <ConversationList
                users={users}
                initialItems={conversations}
                />
            {children}
        </div>
    </Sidebar>
  )
}

export default ConversationLayout