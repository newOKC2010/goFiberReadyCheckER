package loadenv

type Email struct {
	Email    string
	Password string
}

type JWT struct {
	Secret   string
	ExpireIn string
}

type URLCheckCID struct {
	URL    string
	Header string
	Token  string
}

type SetRole struct {
	ItLeader   string
	ItAdmin    string
	SuperAdmin string
}

type MOPHAlert struct {
	URL       string
	Method    string
	ClientID  string
	SecretKey string
}

type CORS struct {
	Origins     []string
	Credentials bool
	Methods     []string
	Headers     []string
}
