import { useParams } from 'react-router-dom'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import createSocketConnection from '../utils/socket'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const MESSAGE_PAGE_SIZE = 20

const mapMessages = (messages) =>
  messages.map((message) => {
    const { sender, text, timestamp } = message
    return {
      firstName: sender.firstName,
      lastName: sender.lastName,
      text,
      timestamp: new Date(timestamp),
    }
  })

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [onlineUserId, setOnlineUserId] = useState(null)
  const messagesContainerRef = useRef(null)
  const hasMoreMessagesRef = useRef(false)
  const nextMessageCursorRef = useRef(null)
  const isLoadingOlderMessagesRef = useRef(false)
  const preserveScrollPositionRef = useRef(false)
  const previousScrollHeightRef = useRef(0)
  const previousScrollTopRef = useRef(0)
  const user = useSelector((store) => store.user)
  const userId = user?._id
  const userFirstName = user?.firstName
  const targetId = String(targetUserId)

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          params: { limit: MESSAGE_PAGE_SIZE },
          withCredentials: true,
        })
        hasMoreMessagesRef.current = data.hasMore
        nextMessageCursorRef.current = data.nextCursor
        setMessages(mapMessages(data.messages))
        setErrorMessage('')
      } catch (error) {
        console.error('Error fetching chat history:', error)
        const responseData = error.response?.data
        const message =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message
        setErrorMessage(
          message || error.message || 'Failed to load chat history.',
        )
      }
    }

    fetchChatHistory()
  }, [targetUserId])

  const loadOlderMessages = async () => {
    if (
      !hasMoreMessagesRef.current ||
      !nextMessageCursorRef.current ||
      isLoadingOlderMessagesRef.current
    ) {
      return
    }

    isLoadingOlderMessagesRef.current = true
    try {
      const { data } = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        params: {
          limit: MESSAGE_PAGE_SIZE,
          before: nextMessageCursorRef.current,
        },
        withCredentials: true,
      })
      const olderMessages = mapMessages(data.messages)
      hasMoreMessagesRef.current = data.hasMore
      nextMessageCursorRef.current = data.nextCursor

      if (olderMessages.length) {
        const messagesContainer = messagesContainerRef.current
        previousScrollHeightRef.current = messagesContainer?.scrollHeight ?? 0
        previousScrollTopRef.current = messagesContainer?.scrollTop ?? 0
        preserveScrollPositionRef.current = true
        setMessages((currentMessages) => [...olderMessages, ...currentMessages])
      }
    } catch (error) {
      console.error('Error fetching older chat messages:', error)
      const responseData = error.response?.data
      const message =
        typeof responseData === 'string'
          ? responseData
          : responseData?.message
      setErrorMessage(message || error.message || 'Failed to load older messages.')
    } finally {
      isLoadingOlderMessagesRef.current = false
    }
  }

  useEffect(() => {
    if (!userId) return
    const socket = createSocketConnection()
    socket.emit('joinChat', { firstName: userFirstName, userId, targetUserId })
    const handlePresenceUpdate = ({ userId: presenceUserId, isOnline }) => {
      if (String(presenceUserId) !== targetId) return
      setOnlineUserId(isOnline ? targetId : null)
    }

    socket.on('presenceUpdate', handlePresenceUpdate)
    socket.on('receiveMessage', ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text, timestamp: new Date() },
      ])
    })

    return () => {
      socket.off('presenceUpdate', handlePresenceUpdate)
      socket.disconnect()
    }
  }, [userId, userFirstName, targetId, targetUserId])

  useLayoutEffect(() => {
    const messagesContainer = messagesContainerRef.current
    if (!messagesContainer) return

    if (preserveScrollPositionRef.current) {
      messagesContainer.scrollTop =
        previousScrollTopRef.current +
        messagesContainer.scrollHeight -
        previousScrollHeightRef.current
      preserveScrollPositionRef.current = false
      return
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }, [messages])

  const handleMessagesScroll = () => {
    if (messagesContainerRef.current?.scrollTop <= 10) {
      loadOlderMessages()
    }
  }

  const handleSendMessage = (event) => {
    event.preventDefault()
    if (!newMessage.trim()) return

    const socket = createSocketConnection()
    socket.emit('sendMessage', {
      firstName: user.firstName,
      lastName: user.lastName,
      text: newMessage,
      userId,
      targetUserId,
    })
    setNewMessage('')
  }

  return (
    <div className='my-7 border w-1/2 flex flex-col mx-auto rounded'>
      <div className='flex items-center gap-2 p-2 border-b'>
        <h1 className='text-lg'>Chat</h1>
        <span
          className={
            onlineUserId === targetId
              ? 'text-xs text-green-500'
              : 'text-xs text-red-500'
          }
        >
          {onlineUserId === targetId ? '(Online)' : '(Offline)'}
        </span>
      </div>
      {errorMessage && (
        <div role='alert' className='alert alert-error m-4'>
          <span>{errorMessage}</span>
        </div>
      )}
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className='p-4 h-[50vh] scroll-auto overflow-y-auto'
      >
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <div
                className={
                  message.firstName === user.firstName
                    ? 'chat chat-end'
                    : 'chat chat-start'
                }
              >
                <div className='chat-header'>
                  {message.firstName} {message.lastName}
                  <time className='text-xs opacity-50'>
                    {message.timestamp.toLocaleTimeString().slice(0, 5)}
                  </time>
                </div>
                <div className='chat-bubble'>{message.text}</div>
                {/* <div className='chat-footer opacity-50'>Seen</div> */}
              </div>
            </div>
          )
        })}
      </div>
      <form
        className='flex justify-between border border-t p-2'
        onSubmit={handleSendMessage}
      >
        <input
          type='text'
          placeholder='Type your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='input input-bordered w-full'
        />
        <button className='btn btn-primary ml-2' type='submit'>
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
