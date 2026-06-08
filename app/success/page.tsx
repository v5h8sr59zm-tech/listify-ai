export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Paiement réussi !
        </h1>
        <p className="text-gray-500 mb-8">
          Bienvenue sur Listify Pro. Tu as maintenant acces a des generations illimitees.
        </p>
        <a href="/generate" className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600">
          Commencer a generer
        </a>
      </div>
    </main>
  )
}